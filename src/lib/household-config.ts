type Environment = Record<string, string | undefined>;

const MINIMUM_SECRET_LENGTH = 32;

export function getHouseholdSessionSecret(environment: Environment = process.env): string {
  const secret = environment.HOUSEHOLD_SESSION_SECRET?.trim();
  if (!secret || secret.length < MINIMUM_SECRET_LENGTH) {
    throw new Error('HOUSEHOLD_SESSION_NOT_CONFIGURED');
  }

  return secret;
}
