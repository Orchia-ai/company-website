import { useEffect, useState } from 'react'

const clients: { name: string; src: string; invert?: boolean; showName?: boolean }[] = [
  { name: 'Artly AI',                 src: '/logos/artly-ai.png'      },
  { name: 'Realhand',                 src: '/logos/realhand.webp'     },
  { name: 'Really AR',                src: '/logos/really-ar.png',    showName: true },
  { name: 'Artly Coffee',             src: '/logos/artly-coffee.png'  },
  { name: 'NYU',                      src: '/logos/nyu.svg'           },
  { name: 'NYU Urban Systems Lab',    src: '/logos/usl.webp'          },
  { name: 'Parsons School of Design', src: '/logos/parsons.svg'       },
  { name: 'TC Games Research Lab',    src: '/logos/tc-games-lab.png', invert: true },
]

export default function Clients() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % clients.length)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="clients-wrapper">
      <div className="clients-header">
        <span className="mono-label">S / 03 — Clients Served</span>
        <span className="mono-label">Partners · 2022&thinsp;—&thinsp;2025</span>
      </div>
      <section className="clients-section">
        <div className="clients-grid">
          {clients.map((c, i) => (
            <div
              key={c.name}
              className={`client-logo-slot${i === activeIdx ? ' client-logo-slot--active' : ''}`}
            >
              <img
                src={c.src}
                alt={c.name}
                className={`client-logo${c.invert ? ' client-logo--invert' : ''}`}
              />
              {c.showName && <span className="client-name">{c.name}</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
