
export const SCENE_TWO_EXIT_DURATION_SECONDS = 1.48;
export const SCENE_THREE_DURATION_SECONDS = 31.04;

type SceneThreeSelector = gsap.utils.SelectorFunc;

/**
 * Scene 3 is the construction state of the exact workspace used by Scene 4.
 * It intentionally renders no second graph. Instead, it reveals and builds
 * the shared `[data-scene4-*]` DOM so the handoff into review has no visual
 * swap, duplicated nodes, or mismatched wiring.
 */
export function appendSceneThreeTimeline(
  timeline: gsap.core.Timeline,
  query: SceneThreeSelector,
  startTime: number,
) {
  const sceneTwoChat = query<HTMLElement>("[data-scene2-chat]");
  const sceneTwoLayer = query<HTMLElement>("[data-scene2-layer]");
  const sharedLayer = query<HTMLElement>("[data-scene4-layer]");
  const workspace = query<HTMLElement>("[data-scene4-workspace]");
  const workspaceHeader = query<HTMLElement>(
    "[data-scene4-workspace-header]",
  );
  const graph = query<HTMLElement>("[data-scene4-graph]");
  const stations = query<HTMLElement>("[data-scene4-station]");
  const chats = query<HTMLElement>("[data-scene4-chat]");
  const cursors = query<HTMLElement>("[data-scene4-cursor]");
  const composerPlaceholders = query<HTMLElement>(
    "[data-scene3-composer-placeholder]",
  );
  const composerDrafts = query<HTMLElement>(
    "[data-scene3-composer-draft]",
  );
  const composerCarets = query<HTMLElement>(
    "[data-scene3-composer-caret]",
  );
  const sceneThreeMessages = [
    ...query<HTMLElement>("[data-scene3-human-message]"),
    ...query<HTMLElement>("[data-scene3-agent-reply]"),
  ];
  const legacySceneFourTransientUi = [
    ...query<HTMLElement>("[data-scene4-human-message]"),
    ...query<HTMLElement>("[data-scene4-agent-reply]"),
    ...query<HTMLElement>("[data-scene4-proposal]"),
    ...query<HTMLElement>("[data-scene4-approve]"),
    ...query<HTMLElement>("[data-scene4-applied]"),
  ];
  const scanLines = query<HTMLElement>("[data-scene4-node-scan]");
  const scanStatus = query<HTMLElement>("[data-scene4-scan-status]");
  const nodeInspector = query<HTMLElement>("[data-scene4-node-inspector]");
  const inspectorBefore = query<HTMLElement>(
    "[data-scene4-inspector-before]",
  );
  const inspectorAfter = query<HTMLElement>("[data-scene4-inspector-after]");
  const inspectorStatus = query<HTMLElement>("[data-scene4-inspector-status]");
  const nodes = query<HTMLElement>("[data-scene4-node]");
  const edges = query<SVGPathElement>("[data-scene4-edge]");
  const reusedNodeIds = new Set([
    "creative-brief",
    "story-research",
    "story-structure",
    "script-draft",
    "art-uploads",
    "visual-research",
    "art-direction",
    "reference-images",
    "scene-references",
    "camera-research",
    "shot-list",
    "camera-previs",
    "platform-data",
    "metrics",
    "social-signals",
    "trend-charts",
  ]);
  const reusedNodes = nodes.filter((node) =>
    reusedNodeIds.has(node.dataset.scene4NodeId ?? ""),
  );
  const newNodeOrder = [
    "audience-signals",
    "creative-scoring",
    "scene-image-groups",
    "movement-coverage",
    "section-beats",
    "outcome-forecast",
    "script-revision",
    "video-prompt",
    "production-plan",
    "video-generation",
    "video-output",
  ];
  const newNodes = newNodeOrder.flatMap((nodeId) =>
    nodes.filter((node) => node.dataset.scene4NodeId === nodeId),
  );
  const reusedEdges = edges.filter(
    (edge) =>
      reusedNodeIds.has(edge.dataset.scene4EdgeFrom ?? "") &&
      reusedNodeIds.has(edge.dataset.scene4EdgeTo ?? ""),
  );
  const newEdges = edges.filter((edge) => !reusedEdges.includes(edge));
  const roleCursorPoint = {
    maya: {
      startX: 92,
      startY: 64,
      inputX: 105,
      sendX: 330,
      composerY: 162,
    },
    nora: {
      startX: 308,
      startY: 64,
      inputX: 126,
      sendX: 350,
      composerY: 162,
    },
    eli: {
      startX: 92,
      startY: 64,
      inputX: 105,
      sendX: 330,
      composerY: -202,
    },
    owen: {
      startX: 308,
      startY: 64,
      inputX: 126,
      sendX: 350,
      composerY: -202,
    },
  } as const;
  const roleTypingDuration = {
    maya: 0.95,
    nora: 1.1,
    eli: 0.9,
    owen: 1,
  } as const;

  type ConversationRole = keyof typeof roleCursorPoint;

  const roleElements = (role: ConversationRole) => ({
    station: query<HTMLElement>(`[data-scene4-station="${role}"]`),
    chat: query<HTMLElement>(`[data-scene4-chat="${role}"]`),
    cursor: query<HTMLElement>(`[data-scene4-cursor="${role}"]`),
    humanMessage: query<HTMLElement>(
      `[data-scene3-human-message="${role}"]`,
    ),
    agentReply: query<HTMLElement>(
      `[data-scene3-agent-reply="${role}"]`,
    ),
    composer: query<HTMLElement>(`[data-scene4-composer="${role}"]`),
    placeholder: query<HTMLElement>(
      `[data-scene3-composer-placeholder="${role}"]`,
    ),
    draft: query<HTMLElement>(`[data-scene3-composer-draft="${role}"]`),
    caret: query<HTMLElement>(`[data-scene3-composer-caret="${role}"]`),
    sendButton: query<HTMLElement>(
      `[data-scene3-composer-send="${role}"]`,
    ),
  });

  const appendHumanInput = (role: ConversationRole, at: number) => {
    const {
      station,
      chat,
      cursor,
      humanMessage,
      agentReply,
      composer,
      placeholder,
      draft,
      caret,
      sendButton,
    } = roleElements(role);
    const draftElement = draft[0];
    const request =
      humanMessage[0]?.dataset.messageCopy ??
      humanMessage[0]?.querySelector("strong")?.textContent?.trim() ??
      "";
    const typingState = { value: 0 };
    const point = roleCursorPoint[role];
    const typeStart = at + 0.52;
    const typeEnd = typeStart + roleTypingDuration[role];
    const sendMoveAt = typeEnd + 0.06;
    const sendAt = typeEnd + 0.26;
    const humanAt = sendAt + 0.24;

    timeline
      // Only one person's action is visible at a time. Hiding all other
      // bubbles before the next composer appears prevents message overlap.
      .set(chats, { autoAlpha: 0, visibility: "hidden" }, at)
      .set(sceneThreeMessages, { autoAlpha: 0 }, at)
      .set(composerDrafts, { autoAlpha: 0, textContent: "" }, at)
      .set(composerCarets, { autoAlpha: 0 }, at)
      .set(composerPlaceholders, { autoAlpha: 1 }, at)
      .set(
        legacySceneFourTransientUi,
        { autoAlpha: 0, visibility: "hidden" },
        at,
      )
      .set(cursors, { autoAlpha: 0 }, at)
      .to(stations, { opacity: 0.24, duration: 0.16 }, at)
      .to(station, { opacity: 1, duration: 0.18 }, at + 0.02)
      .set(chat, { visibility: "visible" }, at + 0.03)
      .fromTo(
        chat,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.16, ease: "power2.out" },
        at + 0.04,
      )
      .set(agentReply, { autoAlpha: 0 }, at)
      .fromTo(
        composer,
        {
          autoAlpha: 0,
          scale: 0.94,
          x: role === "maya" || role === "eli" ? -10 : 10,
        },
        {
          autoAlpha: 1,
          scale: 1,
          x: 0,
          duration: 0.18,
          ease: "back.out(2)",
        },
        at + 0.06,
      )
      .set(
        cursor,
        {
          autoAlpha: 1,
          x: point.startX,
          y: point.startY,
          scale: 1,
        },
        at + 0.08,
      )
      .to(
        cursor,
        {
          x: point.inputX,
          y: point.composerY,
          duration: 0.24,
          ease: "power2.inOut",
        },
        at + 0.16,
      )
      .to(cursor, { scale: 0.74, duration: 0.07 }, at + 0.4)
      .to(cursor, { scale: 1, duration: 0.09 }, at + 0.47)
      .to(
        composer,
        {
          borderColor: "var(--role)",
          duration: 0.1,
          ease: "power2.out",
        },
        at + 0.46,
      )
      .set(placeholder, { autoAlpha: 0 }, at + 0.5)
      .set([...draft, ...caret], { autoAlpha: 1 }, at + 0.5)
      .to(
        typingState,
        {
          value: 1,
          duration: roleTypingDuration[role],
          ease: "none",
          onUpdate: () => {
            const characterCount = Math.ceil(request.length * typingState.value);
            if (!draftElement) {
              return;
            }
            const typedText = request.slice(0, characterCount);
            draftElement.textContent = typedText;
          },
        },
        typeStart,
      )
      .to(
        cursor,
        {
          x: point.sendX,
          y: point.composerY,
          duration: 0.18,
          ease: "power2.inOut",
        },
        sendMoveAt,
      )
      .to(cursor, { scale: 0.72, duration: 0.07 }, sendAt)
      .to(sendButton, { scale: 0.88, duration: 0.07 }, sendAt)
      .to(cursor, { scale: 1, duration: 0.09 }, sendAt + 0.07)
      .to(sendButton, { scale: 1, duration: 0.09 }, sendAt + 0.07)
      .set([...draft, ...caret], { autoAlpha: 0 }, sendAt + 0.15)
      .set(placeholder, { autoAlpha: 1 }, sendAt + 0.15)
      .set(draft, { textContent: "" }, sendAt + 0.15)
      .fromTo(
        humanMessage,
        {
          autoAlpha: 0,
          x: role === "maya" || role === "eli" ? -18 : 18,
          y: 2,
          scale: 0.78,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.22,
          ease: "back.out(2.2)",
        },
        humanAt,
      )
      .to(composer, { autoAlpha: 0, duration: 0.12 }, humanAt + 0.02)
      .to(cursor, { autoAlpha: 0, duration: 0.1 }, humanAt + 0.04);

    return { humanAt, sendAt };
  };

  const appendAgentReply = (role: ConversationRole, at: number) => {
    const { agentReply } = roleElements(role);

    timeline.fromTo(
      agentReply,
      {
        autoAlpha: 0,
        x: role === "maya" || role === "eli" ? -14 : 14,
        y: 2,
        scale: 0.8,
      },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.24,
        ease: "back.out(2)",
      },
      at,
    );

    return at + 0.24;
  };

  const hideConversation = (role: ConversationRole, at: number) => {
    const { chat, cursor, humanMessage, agentReply } = roleElements(role);
    timeline
      .to(
        [...humanMessage, ...agentReply],
        { autoAlpha: 0, y: -4, duration: 0.14, ease: "power2.in" },
        at,
      )
      .to(chat, { autoAlpha: 0, duration: 0.14 }, at + 0.06)
      .set(chat, { visibility: "hidden" }, at + 0.21)
      .set(cursor, { autoAlpha: 0 }, at + 0.21);
  };

  const appendGlobalScan = (at: number) => {
    // Every currently visible node scans simultaneously. This makes the
    // system-wide review read as one action before the agent gives its answer.
    timeline
      .set(
        scanLines,
        {
          autoAlpha: 0.72,
          yPercent: -135,
          visibility: "visible",
        },
        at,
      )
      .fromTo(
        scanStatus,
        { autoAlpha: 0, y: -6 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.16,
          ease: "power2.out",
        },
        at,
      )
      .to(
        scanLines,
        {
          yPercent: 225,
          duration: 0.68,
          ease: "power2.inOut",
        },
        at + 0.02,
      )
      .to(scanLines, { autoAlpha: 0, duration: 0.12 }, at + 0.62)
      .to(
        scanStatus,
        {
          autoAlpha: 0,
          y: -6,
          duration: 0.14,
          ease: "power2.in",
        },
        at + 0.68,
      );

    return at + 0.82;
  };

  const focusedNodesFor = (nodeIds: readonly string[]) =>
    nodeIds.flatMap((nodeId) =>
      nodes.filter((node) => node.dataset.scene4NodeId === nodeId),
    );

  const dimAndHighlightNodes = (
    nodeIds: readonly string[],
    at: number,
    roleColor: string,
  ) => {
    const focusedNodes = focusedNodesFor(nodeIds);

    timeline
      .to(
        nodes,
        {
          opacity: 0.2,
          scale: 1,
          backgroundColor: "#f4f0e9",
          boxShadow: "0 5px 12px rgba(55, 46, 36, 0.10)",
          duration: 0.16,
        },
        at,
      )
      .to(
        focusedNodes,
        {
          opacity: 1,
          scale: 1.045,
          backgroundColor: "#fffaf2",
          boxShadow: `0 0 0 2px ${roleColor}, 0 10px 20px rgba(55, 46, 36, 0.16)`,
          duration: 0.2,
          stagger: 0.025,
          ease: "power2.out",
        },
        at + 0.04,
      );

    return focusedNodes;
  };

  const restoreWorkspaceFocus = (at: number) => {
    timeline
      .to(
        nodes,
        {
          opacity: 1,
          scale: 1,
          backgroundColor: "#f4f0e9",
          boxShadow: "0 5px 12px rgba(55, 46, 36, 0.10)",
          duration: 0.22,
          ease: "power2.inOut",
        },
        at,
      )
      .to(stations, { opacity: 0.34, duration: 0.2 }, at);
  };

  /*
   * The old full chat-panel sequence intentionally stops here. Scene 3 now
   * uses one composer action plus two standalone bubbles for each specialist.
   * The workflow remains the dominant visual at every step.
   */
  const appendConversation = (
    role: ConversationRole,
    at: number,
    responseDelay = 0.48,
  ) => {
    const input = appendHumanInput(role, at);
    const agentAt = input.humanAt + responseDelay;
    appendAgentReply(role, agentAt);
    return { ...input, agentAt, actionAt: agentAt + 0.96 };
  };

  /*
   * A scan is deliberately not bundled into appendConversation: Eli and Owen
   * need the global scan to finish before the agent response appears.
   */
  const appendScannedReview = (
    role: ConversationRole,
    at: number,
    nodeIds: readonly string[],
    roleColor: string,
  ) => {
    const input = appendHumanInput(role, at);
    const scanAt = input.humanAt + 0.42;
    const responseAt = appendGlobalScan(scanAt) + 0.12;
    appendAgentReply(role, responseAt);
    const highlightAt = responseAt + 1.14;
    const focusedNodes = dimAndHighlightNodes(
      nodeIds,
      highlightAt,
      roleColor,
    );

    return {
      ...input,
      responseAt,
      highlightAt,
      focusedNodes,
    };
  };

  timeline
    .set(sharedLayer, { autoAlpha: 0 }, 0)
    .set(workspace, {
      autoAlpha: 0,
      clipPath: "inset(49.2% 49.5% 49.2% 49.5%)",
      x: 0,
      y: 0,
      scale: 0.94,
      transformOrigin: "50% 50%",
    }, 0)
    .set(workspaceHeader, { autoAlpha: 0, y: -8 }, 0)
    .set(graph, { x: 0, y: 0, scale: 1 }, 0)
    .set(stations, { autoAlpha: 0 }, 0)
    // Scene 3 keeps the four people around the shared workspace, but their
    // conversations appear one at a time after the workspace has formed.
    .set(chats, { autoAlpha: 0, visibility: "hidden" }, 0)
    .set(sceneThreeMessages, { autoAlpha: 0 }, 0)
    .set(
      legacySceneFourTransientUi,
      { autoAlpha: 0, visibility: "hidden" },
      0,
    )
    .set(cursors, { autoAlpha: 0 }, 0)
    .set(scanLines, { autoAlpha: 0, yPercent: -135 }, 0)
    .set(scanStatus, { autoAlpha: 0 }, 0)
    .set(
      nodeInspector,
      {
        autoAlpha: 0,
        scale: 0.9,
        visibility: "hidden",
        transformOrigin: "50% 50%",
      },
      0,
    )
    .set(inspectorBefore, { autoAlpha: 1 }, 0)
    .set(inspectorAfter, { autoAlpha: 0 }, 0)
    .set(inspectorStatus, { autoAlpha: 0, y: 5 }, 0)
    // The 16 personal cards fade-swap into these resting targets. The other
    // nodes start at zero scale so their later entrances read as true pops.
    .set(reusedNodes, { autoAlpha: 0, y: 0, scale: 0.94 }, 0)
    .set(newNodes, { autoAlpha: 0, y: 0, scale: 0 }, 0)
    .set(
      edges,
      {
        autoAlpha: 0,
        opacity: 0,
        visibility: "hidden",
        strokeDashoffset: 1,
      },
      0,
    )

    // Close the familiar collaboration interface as one continuous object.
    // The full Slack-like UI remains visible throughout the motion while the
    // four people and their cards stay fixed around it. The bridge begins as
    // soon as this clean exit completes, so no extra title-card hold remains.
    .to(
      sceneTwoChat,
      {
        scale: 0.94,
        duration: SCENE_TWO_EXIT_DURATION_SECONDS - 0.08,
        ease: "power3.inOut",
      },
      startTime,
    )
    .to(
      sceneTwoChat,
      {
        autoAlpha: 0,
        duration: 0.36,
        ease: "power2.in",
      },
      startTime + SCENE_TWO_EXIT_DURATION_SECONDS - 0.36,
    )
    .to(
      {},
      { duration: 0.01 },
      startTime + SCENE_TWO_EXIT_DURATION_SECONDS - 0.01,
    )
    .set(
      sceneTwoLayer,
      { autoAlpha: 0 },
      startTime + SCENE_TWO_EXIT_DURATION_SECONDS,
    )

    // Switch to the shared canvas only after the direct movement is almost
    // complete. Its warm background matches the existing stage, so no
    // full-layer dissolve is needed. The fixed people appear at the same
    // geometry where the moving person clones finish.
    .set(
      sharedLayer,
      { autoAlpha: 1 },
      startTime + SCENE_TWO_EXIT_DURATION_SECONDS,
    )
    // The people remain as exact-position moving clones during the new
    // post-Slack beat and merge. Reveal their fixed Scene 4 counterparts only
    // when that 0.96s move has completed, avoiding a duplicate/fade swap.
    .set(stations, { autoAlpha: 1, opacity: 1 }, startTime + 2.68)

    // Once the compact 4×4 card cluster has settled, the shared workspace
    // expands from that same center behind it. The cards remain untouched and
    // fully visible until the frame is complete.
    .fromTo(
      workspace,
      {
        autoAlpha: 0,
        clipPath: "inset(49.2% 49.5% 49.2% 49.5%)",
        x: 0,
        y: 0,
        scale: 0.94,
        transformOrigin: "50% 50%",
      },
      {
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.76,
        ease: "power4.out",
      },
      startTime + 2.98,
    )
    .to(
      workspaceHeader,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.34,
        ease: "power2.out",
      },
      startTime + 3.38,
    );

  // Maya gives the first explicit human instruction. Her message and the
  // agent's response remain readable while the master timeline settles the 16
  // existing work cards into their exact graph positions.
  appendConversation("maya", startTime + 3.76);

  // Once those cards have landed, connect only the relationships that already
  // existed in the four personal systems. Drawing starts after Maya's reply.
  const reusedEdgeStart = startTime + 8.06;
  timeline
    .set(
      reusedEdges,
      {
        autoAlpha: 1,
        opacity: 1,
        visibility: "visible",
        strokeDashoffset: 1,
      },
      reusedEdgeStart,
    )
    .to(
      reusedEdges,
      {
        strokeDashoffset: 0,
        duration: 0.38,
        stagger: { each: 0.012, from: "start" },
        ease: "power2.inOut",
      },
      reusedEdgeStart,
    );
  hideConversation("maya", reusedEdgeStart - 0.12);

  // Nora asks for shared visual continuity. Only after the reply do the
  // genuinely new agent capabilities enter, one at a time.
  const noraConversation = appendConversation("nora", startTime + 8.5);
  const newNodeStart = noraConversation.actionAt + 0.1;
  hideConversation("nora", newNodeStart - 0.14);
  newNodes.forEach((node, nodeIndex) => {
    const popAt = newNodeStart + nodeIndex * 0.075;
    timeline
      .fromTo(
        node,
        {
          autoAlpha: 0,
          scale: 0,
          y: 0,
        },
        {
          autoAlpha: 1,
          scale: 1.1,
          y: 0,
          duration: 0.18,
          ease: "back.out(3.2)",
        },
        popAt,
      )
      .to(
        node,
        {
          scale: 1,
          duration: 0.09,
          ease: "power2.out",
        },
        popAt + 0.18,
      );
  });

  // The new edges wait for every new node to settle, then draw in dependency
  // phases. Existing edges remain visible as stable context.
  const edgeStart = newNodeStart + newNodes.length * 0.075 + 0.22;
  const edgePhaseSpacing = 0.09;

  for (let phase = 0; phase < 5; phase += 1) {
    const phaseEdges = newEdges.filter(
      (edge) => edge.dataset.scene4EdgePhase === String(phase),
    );
    const phaseAt = edgeStart + phase * edgePhaseSpacing;

    timeline
      .set(
        phaseEdges,
        {
          autoAlpha: 1,
          opacity: 1,
          visibility: "visible",
          strokeDashoffset: 1,
        },
        phaseAt,
      )
      .to(
        phaseEdges,
        {
          strokeDashoffset: 0,
          duration: 0.22,
          stagger: {
            each: 0.008,
            from: "start",
          },
          ease: "power2.inOut",
        },
        phaseAt,
    );
  }

  // Eli asks a camera question, the production agent scans the entire visible
  // graph at once, and only then returns the diagnosis.
  const eliReview = appendScannedReview(
    "eli",
    startTime + 14.72,
    [
      "camera-research",
      "shot-list",
      "camera-previs",
      "movement-coverage",
      "video-prompt",
    ],
    "#3E7872",
  );

  const eliCursor = roleElements("eli").cursor;
  const movementCoverageNode = query<HTMLElement>(
    '[data-scene4-node-id="movement-coverage"]',
  );
  const inspectorOpenAt = eliReview.highlightAt + 0.78;

  // Eli's cursor opens the affected movement node. The detail card shows one
  // concrete before/after adjustment instead of another generic chat panel.
  timeline
    .set(
      eliCursor,
      {
        autoAlpha: 1,
        x: roleCursorPoint.eli.sendX,
        y: roleCursorPoint.eli.composerY,
        scale: 1,
      },
      eliReview.highlightAt + 0.28,
    )
    .to(
      eliCursor,
      {
        x: 1360,
        y: -247,
        duration: 0.42,
        ease: "power2.inOut",
      },
      eliReview.highlightAt + 0.32,
    )
    .to(eliCursor, { scale: 0.72, duration: 0.07 }, inspectorOpenAt - 0.06)
    .to(movementCoverageNode, { scale: 0.98, duration: 0.07 }, inspectorOpenAt)
    .to(eliCursor, { scale: 1, duration: 0.09 }, inspectorOpenAt + 0.01)
    .to(
      movementCoverageNode,
      { scale: 1.045, duration: 0.1 },
      inspectorOpenAt + 0.07,
    )
    .set(nodeInspector, { visibility: "visible" }, inspectorOpenAt + 0.08)
    .fromTo(
      nodeInspector,
      { autoAlpha: 0, scale: 0.88, y: 12 },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.26,
        ease: "back.out(2)",
      },
      inspectorOpenAt + 0.08,
    )
    .to(
      eliCursor,
      {
        x: 1020,
        y: -285,
        duration: 0.34,
        ease: "power2.inOut",
      },
      inspectorOpenAt + 0.48,
    )
    .to(eliCursor, { scale: 0.72, duration: 0.07 }, inspectorOpenAt + 0.84)
    .to(eliCursor, { scale: 1, duration: 0.09 }, inspectorOpenAt + 0.91)
    .to(
      inspectorBefore,
      { autoAlpha: 0, y: -4, duration: 0.14 },
      inspectorOpenAt + 0.92,
    )
    .fromTo(
      inspectorAfter,
      { autoAlpha: 0, y: 5 },
      { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" },
      inspectorOpenAt + 1.02,
    )
    .fromTo(
      inspectorStatus,
      { autoAlpha: 0, y: 5 },
      { autoAlpha: 1, y: 0, duration: 0.2, ease: "back.out(2)" },
      inspectorOpenAt + 1.18,
    )
    .to(eliCursor, { autoAlpha: 0, duration: 0.12 }, inspectorOpenAt + 1.18);

  const eliRecoverAt = inspectorOpenAt + 2.2;
  timeline
    .to(
      nodeInspector,
      {
        autoAlpha: 0,
        scale: 0.94,
        y: 8,
        duration: 0.2,
        ease: "power2.in",
      },
      eliRecoverAt,
    )
    .set(nodeInspector, { visibility: "hidden" }, eliRecoverAt + 0.21);
  hideConversation("eli", eliRecoverAt);
  restoreWorkspaceFocus(eliRecoverAt + 0.05);

  // Owen closes the sequence. His scan also happens across every node at once,
  // followed by one readable data conclusion and a brief evidence highlight.
  const owenReview = appendScannedReview(
    "owen",
    startTime + 23.18,
    [
      "metrics",
      "social-signals",
      "trend-charts",
      "audience-signals",
      "outcome-forecast",
    ],
    "#71804D",
  );

  const finalCleanupAt = startTime + 29.5;
  timeline
    // Give the audience a full beat to read Owen's response and see the
    // highlighted evidence nodes before returning to the connected overview.
    .to({}, { duration: 0.01 }, owenReview.highlightAt + 1.45);
  hideConversation("owen", finalCleanupAt);
  restoreWorkspaceFocus(finalCleanupAt);

  timeline
    .set(sceneThreeMessages, { autoAlpha: 0 }, finalCleanupAt + 0.22)
    .set(
      legacySceneFourTransientUi,
      { autoAlpha: 0, visibility: "hidden" },
      finalCleanupAt + 0.22,
    )
    .set(scanLines, { autoAlpha: 0 }, finalCleanupAt + 0.22)
    .set(scanStatus, { autoAlpha: 0 }, finalCleanupAt + 0.22)
    .set(nodeInspector, { autoAlpha: 0, visibility: "hidden" }, finalCleanupAt)
    .set(cursors, { autoAlpha: 0 }, finalCleanupAt + 0.22)
    .set(
      composerDrafts,
      { autoAlpha: 0, textContent: "" },
      finalCleanupAt + 0.22,
    )
    .set(composerCarets, { autoAlpha: 0 }, finalCleanupAt + 0.22)
    .to(chats, { autoAlpha: 0, duration: 0.16 }, finalCleanupAt + 0.1)
    .set(chats, { visibility: "hidden" }, finalCleanupAt + 0.28)
    .to(
      stations,
      {
        opacity: 0.34,
        duration: 0.32,
        ease: "power2.inOut",
      },
      finalCleanupAt,
    )
    // Extend the scene through one calm resolved-workspace hold before the
    // ending title covers it.
    .to(
      {},
      { duration: 0.01 },
      startTime + SCENE_THREE_DURATION_SECONDS - 0.01,
    );

  return startTime + SCENE_THREE_DURATION_SECONDS;
}

export function SceneThreeLayer() {
  return null;
}
