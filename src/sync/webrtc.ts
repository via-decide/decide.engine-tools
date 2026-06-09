/**
 * WebRTC P2P Sync Wrapper
 * Uses PeerJS (Transient Signaling Server) to connect two devices.
 * Zero user data is stored on the signaling server.
 */

// Note: Requires PeerJS imported in index.html: <script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>

export class ZeroCloudP2P {
  private peer: any; // PeerJS Instance
  private connections: Map<string, any> = new Map();

  constructor(localIdentityId: string) {
    // Initialize PeerJS with public transient server (or custom local broker)
    // localIdentityId acts as the exact address someone must use to call you.
    this.peer = new (window as any).Peer(localIdentityId, {
      debug: 2
    });

    this.peer.on('open', (id: string) => {
      console.log('ZeroCloud P2P Node Online. Peer ID:', id);
    });

    this.peer.on('connection', (conn: any) => {
      this.handleIncomingConnection(conn);
    });

    this.peer.on('error', (err: Error) => {
      console.error('PeerJS Transient Server Error:', err);
    });
  }

  /**
   * Connect to another peer using their Identity ID
   */
  public connectToPeer(remoteId: string) {
    console.log(`Attempting P2P connection to ${remoteId}...`);
    const conn = this.peer.connect(remoteId);
    
    conn.on('open', () => {
      console.log(`Connected to ${remoteId}`);
      this.connections.set(remoteId, conn);
      
      // Setup receive handler
      conn.on('data', (data: any) => {
        this.handleIncomingData(remoteId, data);
      });
    });
  }

  /**
   * Broadcast a Database sync payload to a specific peer
   */
  public sendSyncPayload(remoteId: string, payload: any) {
    const conn = this.connections.get(remoteId);
    if (conn && conn.open) {
      conn.send({ type: 'SYNC_PAYLOAD', data: payload });
    } else {
      console.warn(`Connection to ${remoteId} is not open.`);
    }
  }

  private handleIncomingConnection(conn: any) {
    console.log(`Incoming connection established from ${conn.peer}`);
    this.connections.set(conn.peer, conn);

    conn.on('data', (data: any) => {
      this.handleIncomingData(conn.peer, data);
    });
  }

  private handleIncomingData(peerId: string, data: any) {
    console.log(`Data received from ${peerId}:`, data);
    // In production, this data would be parsed and inserted into Dexie IDB.
    // e.g. if (data.type === 'SYNC_PAYLOAD') { db.messages.bulkPut(data.data.messages); }
  }
}
