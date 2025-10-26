/** tiny helper: convert "15m"/"7d"/"3600" to milliseconds */
export const parseExpiryToMilliSeconds = (exp: string): number => {
  // numeric string => milliseconds
  if (/^\d+$/.test(exp)) return Number(exp);

  const m = /^(\d+)([smhd])$/.exec(exp);
  if (!m) {
    // fallback: try ms-like values (not using ms lib). Default 0.
    return 0;
  }
  const n = Number(m[1]);
  const unit = m[2];
  switch (unit) {
    case 's':
      return n * 1_000;
    case 'm':
      return n * 60 * 1_000;
    case 'h':
      return n * 60 * 60 * 1_000;
    case 'd':
      return n * 60 * 60 * 24 * 1_000;
    default:
      return n;
  }
};
