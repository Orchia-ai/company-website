export default function Contact() {
  return (
    <section className="cta" id="contact">
      <div className="cta-copy">
        <p className="eyebrow">Ready to move</p>
        <h2>Let's talk about what you're building.</h2>
        <p className="cta-sub">
          We respond within one business day. We don't send proposals — we start with a conversation.
        </p>
      </div>
      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <input type="text" className="contact-input" placeholder="Name" required />
        <input type="email" className="contact-input" placeholder="Email" required />
        <textarea className="contact-input contact-textarea" placeholder="Tell us about your project..." rows={5} />
        <button type="submit" className="button-primary">Send message</button>
      </form>
    </section>
  )
}
