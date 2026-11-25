export function getThemeConfettiColors(): string[] {
  const styles = getComputedStyle(document.documentElement);
  const colors = ["--primary", "--secondary", "--accent"]
    .map((token) => styles.getPropertyValue(token).trim())
    .filter(Boolean);

  if (colors.length !== 3) {
    throw new Error("The active vibe is missing required confetti color tokens.");
  }

  return colors;
}
