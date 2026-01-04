/**
 * Get Minecraft player headshot URL
 * Uses crafatar.com for Minecraft avatar renders
 */
export function getMinecraftHeadshot(minecraftUsername: string | null | undefined, size: number = 128): string {
  if (!minecraftUsername) {
    // Default placeholder if no Minecraft username
    return `https://ui-avatars.com/api/?name=Player&size=${size}&background=0A0E27&color=00A8E8&bold=true`;
  }
  
  // Using crafatar.com for Minecraft heads
  // Size options: 8-512 pixels
  return `https://crafatar.com/avatars/${minecraftUsername}?size=${size}&overlay`;
}

/**
 * Get full Minecraft skin render
 */
export function getMinecraftSkinRender(minecraftUsername: string | null | undefined, size: number = 256): string {
  if (!minecraftUsername) {
    return `https://ui-avatars.com/api/?name=Player&size=${size}&background=0A0E27&color=00A8E8&bold=true`;
  }
  
  // Full body render
  return `https://crafatar.com/renders/body/${minecraftUsername}?size=${size}&overlay`;
}
