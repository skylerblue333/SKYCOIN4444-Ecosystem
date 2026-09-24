import crypto from "crypto";

interface PoolCredential {
  id: string;
  poolName: string;
  coin: string;
  username: string;
  password: string; // Encrypted
  poolUrl: string;
  poolPort: number;
  isActive: boolean;
  createdAt: number;
  lastUsed?: number;
}

interface MinerConfig {
  id: string;
  name: string;
  hardwareType: string;
  hashrate: number;
  power: number;
  assignedPool: string;
  isActive: boolean;
  createdAt: number;
}

/**
 * Pool Credentials Manager
 * Securely manages mining pool credentials and hardware configuration
 */
export class PoolCredentialsManager {
  private credentials: Map<string, PoolCredential> = new Map();
  private minerConfigs: Map<string, MinerConfig> = new Map();

  /**
   * Add pool credentials
   */
  addPoolCredential(
    poolName: string,
    coin: string,
    username: string,
    password: string,
    poolUrl: string,
    poolPort: number
  ): PoolCredential {
    const id = `pool-${crypto.randomUUID()}`;

    const credential: PoolCredential = {
      id,
      poolName,
      coin,
      username,
      password: this.encryptPassword(password),
      poolUrl,
      poolPort,
      isActive: true,
      createdAt: Date.now(),
    };

    this.credentials.set(id, credential);
    console.log(`[Pool] Added credentials for ${poolName} (${coin})`);

    return credential;
  }

  /**
   * Get pool credential (decrypted)
   */
  getPoolCredential(id: string): PoolCredential | null {
    const cred = this.credentials.get(id);
    if (!cred) return null;

    return {
      ...cred,
      password: this.decryptPassword(cred.password),
    };
  }

  /**
   * Get all active pool credentials
   */
  getActiveCredentials(): PoolCredential[] {
    const active: PoolCredential[] = [];
    for (const [, cred] of this.credentials) {
      if (cred.isActive) {
        active.push({
          ...cred,
          password: this.decryptPassword(cred.password),
        });
      }
    }
    return active;
  }

  /**
   * Get credentials by coin
   */
  getCredentialsByCoin(coin: string): PoolCredential[] {
    const result: PoolCredential[] = [];
    for (const [, cred] of this.credentials) {
      if (cred.coin === coin && cred.isActive) {
        result.push({
          ...cred,
          password: this.decryptPassword(cred.password),
        });
      }
    }
    return result;
  }

  /**
   * Deactivate pool credential
   */
  deactivateCredential(id: string): boolean {
    const cred = this.credentials.get(id);
    if (!cred) return false;

    cred.isActive = false;
    console.log(`[Pool] Deactivated credentials: ${cred.poolName}`);
    return true;
  }

  /**
   * Add miner configuration
   */
  addMinerConfig(
    name: string,
    hardwareType: string,
    hashrate: number,
    power: number,
    assignedPool: string
  ): MinerConfig {
    const id = `miner-${crypto.randomUUID()}`;

    const config: MinerConfig = {
      id,
      name,
      hardwareType,
      hashrate,
      power,
      assignedPool,
      isActive: true,
      createdAt: Date.now(),
    };

    this.minerConfigs.set(id, config);
    console.log(`[Miner] Added configuration: ${name} (${hardwareType})`);

    return config;
  }

  /**
   * Get miner configuration
   */
  getMinerConfig(id: string): MinerConfig | null {
    return this.minerConfigs.get(id) || null;
  }

  /**
   * Get all active miner configurations
   */
  getActiveMinerConfigs(): MinerConfig[] {
    const active: MinerConfig[] = [];
    for (const [, config] of this.minerConfigs) {
      if (config.isActive) {
        active.push(config);
      }
    }
    return active;
  }

  /**
   * Update miner pool assignment
   */
  updateMinerPoolAssignment(minerId: string, poolId: string): boolean {
    const config = this.minerConfigs.get(minerId);
    if (!config) return false;

    config.assignedPool = poolId;
    console.log(`[Miner] Updated pool assignment: ${config.name} -> ${poolId}`);
    return true;
  }

  /**
   * Deactivate miner
   */
  deactivateMiner(id: string): boolean {
    const config = this.minerConfigs.get(id);
    if (!config) return false;

    config.isActive = false;
    console.log(`[Miner] Deactivated: ${config.name}`);
    return true;
  }

  /**
   * Get mining configuration summary
   */
  getConfigurationSummary() {
    const activeCredentials = this.getActiveCredentials();
    const activeMiners = this.getActiveMinerConfigs();

    const totalHashrate = activeMiners.reduce((sum, m) => sum + m.hashrate, 0);
    const totalPower = activeMiners.reduce((sum, m) => sum + m.power, 0);

    const coinDistribution: Record<string, number> = {};
    for (const cred of activeCredentials) {
      coinDistribution[cred.coin] = (coinDistribution[cred.coin] || 0) + 1;
    }

    return {
      poolCount: activeCredentials.length,
      minerCount: activeMiners.length,
      totalHashrate,
      totalPower,
      coinDistribution,
      pools: activeCredentials.map(c => ({
        name: c.poolName,
        coin: c.coin,
        url: c.poolUrl,
        port: c.poolPort,
      })),
      miners: activeMiners.map(m => ({
        name: m.name,
        hardware: m.hardwareType,
        hashrate: m.hashrate,
        power: m.power,
      })),
    };
  }

  private getEncryptionKey(): string {
    const key = process.env.POOL_ENCRYPTION_KEY;
    if (!key || key.length < 32) {
      throw new Error(
        "POOL_ENCRYPTION_KEY must be configured with at least 32 characters"
      );
    }
    return key;
  }

  /**
   * Encrypt password with a per-record salt and IV.
   * Format: v1:<salt-hex>:<iv-hex>:<ciphertext-hex>
   */
  private encryptPassword(password: string): string {
    const algorithm = "aes-256-cbc";
    const salt = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.getEncryptionKey(), salt, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");
    return ["v1", salt.toString("hex"), iv.toString("hex"), encrypted].join(":");
  }

  /**
   * Decrypt password. Legacy two-part ciphertext is supported only when a
   * real POOL_ENCRYPTION_KEY is configured; no default key is accepted.
   */
  private decryptPassword(encrypted: string): string {
    const algorithm = "aes-256-cbc";
    const parts = encrypted.split(":");
    let salt: Buffer;
    let ivHex: string;
    let ciphertext: string;

    if (parts.length === 4 && parts[0] === "v1") {
      salt = Buffer.from(parts[1], "hex");
      ivHex = parts[2];
      ciphertext = parts[3];
    } else if (parts.length === 2) {
      salt = Buffer.from("salt", "utf8");
      ivHex = parts[0];
      ciphertext = parts[1];
    } else {
      throw new Error("Unsupported encrypted pool credential format");
    }

    const key = crypto.scryptSync(this.getEncryptionKey(), salt, 32);
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(ciphertext, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  /**
   * Export configuration (for backup)
   */
  exportConfiguration(): string {
    const data = {
      credentials: Array.from(this.credentials.values()),
      miners: Array.from(this.minerConfigs.values()),
      exportedAt: Date.now(),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import configuration (from backup)
   */
  importConfiguration(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      // Import credentials
      for (const cred of data.credentials) {
        this.credentials.set(cred.id, cred);
      }

      // Import miners
      for (const miner of data.miners) {
        this.minerConfigs.set(miner.id, miner);
      }

      console.log(
        `[Pool] Imported configuration: ${data.credentials.length} pools, ${data.miners.length} miners`
      );
      return true;
    } catch (error) {
      console.error("[Pool] Import failed:", error);
      return false;
    }
  }
}

// Export singleton
export const poolCredentialsManager = new PoolCredentialsManager();
