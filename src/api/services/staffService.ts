import api from "../axiosConfig";

type PresenceStatus = "ONLINE" | "AWAY" | "OFFLINE";
type PresenceResponse = { ok: boolean };

class StaffService {
  private readonly basePath = "/staff";

  async setOnline(max?: number): Promise<PresenceResponse> {
    const body: { status: PresenceStatus; max?: number } = {
      status: "ONLINE",
    };

    if (max !== undefined) {
      body.max = max;
    }

    const response = await api.post<PresenceResponse>(
      `${this.basePath}/presence`,
      body
    );

    return response.data;
  }

  async setOffline(): Promise<PresenceResponse> {
    const response = await api.post<PresenceResponse>(
      `${this.basePath}/presence`,
      {
        status: "OFFLINE",
      }
    );

    return response.data;
  }

  /**
   * Get conversations của staff
   * GET /staff/conversations
   */
  async getConversations(state?: string, limit?: number, skip?: number) {
    const response = await api.get(`${this.basePath}/conversations`, {
      params: { state, limit, skip },
      withCredentials: true,
    });
    return response.data;
  }

  /**
   * Get conversation details
   * GET /staff/conversations/:id
   */
  async getConversationDetail(conversationId: string) {
    const response = await api.get(
      `${this.basePath}/conversations/${conversationId}`,
      { withCredentials: true }
    );
    return response.data;
  }

  /**
   * Mark messages as read
   * PATCH /staff/conversations/:id/read
   */
  async markAsRead(conversationId: string) {
    const response = await api.patch(
      `${this.basePath}/conversations/${conversationId}/read`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }

  /**
   * Get staff stats
   * GET /staff/stats
   */
  async getStats() {
    const response = await api.get(`${this.basePath}/stats`, {
      withCredentials: true,
    });
    return response.data;
  }
}

export default new StaffService();
