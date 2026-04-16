import asyncio
import structlog

logger = structlog.get_logger()

class IPIntelligenceEngine:
    def __init__(self):
        # Simulating a database of high-risk IP ranges
        self.bad_prefixes = ["192.168.66", "10.0.99"]
        self.tor_nodes = ["1.1.1.1", "2.2.2.2"]

    async def get_ip_risk(self, ip: str) -> float:
        """
        Simulates IP reputation lookup.
        """
        logger.info("ip_lookup_start", ip=ip)
        await asyncio.sleep(0.05)

        if not ip:
            return 0.5 # Unknown IP is suspicious

        # Simulate TOR detection
        if ip in self.tor_nodes:
            logger.warning("tor_node_detected", ip=ip)
            return 0.9

        # Simulate blacklisted range
        for prefix in self.bad_prefixes:
            if ip.startswith(prefix):
                logger.warning("blacklisted_ip_range", ip=ip)
                return 0.8

        # Basic safe IP
        return 0.05

ip_engine = IPIntelligenceEngine()
