import { Injectable, Logger } from '@nestjs/common';
import { Etcd3 } from 'etcd3';

@Injectable()
export class EtcdService {
  private readonly logger = new Logger(EtcdService.name);
  private client: Etcd3;
  private servicePrefix = '/services/';
  private leaseTtl = 30;

  constructor() {
    const etcdHost =
      process.env.ETCD_URL?.replace('http://', '').split(':')[0] || 'localhost';
    const etcdPort = parseInt(process.env.ETCD_PORT || '2379', 10);

    this.client = new Etcd3({
      hosts: [`${etcdHost}:${etcdPort}`],
      dialTimeout: 3000,
    });
  }

  async registerService(
    serviceName: string,
    serviceId: string,
    host: string,
    port: number,
  ): Promise<void> {
    try {
      // Create a lease
      const lease = this.client.lease(this.leaseTtl);
      const leaseId = await lease.grant(); // Get the lease ID

      const serviceKey = `${this.servicePrefix}${serviceName}/${serviceId}`;
      const serviceData = {
        name: serviceName,
        id: serviceId,
        address: host,
        port: port,
        registeredAt: new Date().toISOString(),
      };

      // Put service data with lease ID using fluent API
      await this.client
        .put(serviceKey)
        .value(JSON.stringify(serviceData))
        .lease(leaseId);  // Use lease ID

      // Keep lease alive
      this.keepLeaseAlive(lease);

      this.logger.log(`✅ Registered ${serviceName} with etcd`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to register ${serviceName} with etcd:`,
        error,
      );
      throw error;
    }
  }

  private keepLeaseAlive(lease: any): void {
    const interval = setInterval(
      async () => {
        try {
          await lease.keepaliveOnce();
        } catch (error) {
          this.logger.error('Failed to keep lease alive:', error);
          clearInterval(interval);
        }
      },
      (this.leaseTtl * 1000) / 2,
    ); // Refresh halfway through TTL
  }

  async deregisterService(
    serviceName: string,
    serviceId: string,
  ): Promise<void> {
    try {
      const serviceKey = `${this.servicePrefix}${serviceName}/${serviceId}`;
      await this.client.delete().key(serviceKey);
      this.logger.log(`✅ Deregistered ${serviceName} from etcd`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to deregister ${serviceName} from etcd:`,
        error,
      );
    }
  }

  async discoverService(
    serviceName: string,
  ): Promise<{ address: string; port: number } | null> {
    try {
      const servicePrefix = `${this.servicePrefix}${serviceName}/`;

      const services = await this.client.getAll().prefix(servicePrefix);

      for (const [key, value] of Object.entries(services)) {
        if (value) {
          const serviceData = JSON.parse(value.toString());
          return {
            address: serviceData.address,
            port: serviceData.port,
          };
        }
      }

      return null;
    } catch (error) {
      this.logger.error(`❌ Failed to discover service ${serviceName}:`, error);
      return null;
    }
  }

  async getServiceUrl(serviceName: string): Promise<string | null> {
    const service = await this.discoverService(serviceName);
    if (service) {
      return `http://${service.address}:${service.port}`;
    }
    return null;
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
