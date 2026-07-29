import styles from "./typography-interstitial.module.css";

export type TypographyInterstitialKey = "intro" | "bridge" | "ending";

type TypographyInterstitialProps = {
  interstitialKey: TypographyInterstitialKey;
  headline: string;
  brand?: string;
};

/**
 * A shared, typography-only transition for the continuous Feature 5 film.
 *
 * Copy intentionally lives at the call site so the story can be revised
 * without touching layout or motion code.
 */
export function TypographyInterstitial({
  interstitialKey,
  headline,
  brand,
}: TypographyInterstitialProps) {
  return (
    <section
      className={`${styles.interstitial} ${styles[interstitialKey]}`}
      data-typography-interstitial={interstitialKey}
      aria-label={headline}
    >
      <div className={styles.copy} data-typography-interstitial-copy>
        {brand ? (
          <p className={styles.brand} data-typography-interstitial-brand>
            {brand}
          </p>
        ) : null}
        <h1
          className={styles.headline}
          data-typography-interstitial-headline
        >
          {headline}
        </h1>
      </div>
    </section>
  );
}
