const BASE_URL = "http://localhost:3000/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API error:', endpoint, response.status, response.statusText, errorData);
    throw new Error(errorData.message || errorData.status?.message || 'Request failed');
  }

  const jsonResponse = await response.json();

  return jsonResponse;
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint),
  post: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) =>
    fetchWithAuth(endpoint, {
      method: "DELETE",
    }),
  postFormData: async (endpoint: string, formData: FormData) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  sms: {
    send: (phoneNumber: string, message: string) => 
      api.post('sms/send', { phoneNumber, message }),
    
    sendBulk: (phoneNumbers: string[], message: string) => 
      api.post('sms/bulk', { phoneNumbers, message }),
    
    getStatus: (messageId: string) => 
      api.get(`sms/status/${messageId}`),
    
    getBalance: () => 
      api.get('sms/balance'),
  },

  messages: {
    getAll: () => 
      api.get('messages'),
    
    getById: (id: number) => 
      api.get(`messages/${id}`),
    
    delete: (id: number) => 
      api.delete(`messages/${id}`),
    
    getStatus: (id: number) => 
      api.get(`messages/${id}/status`),
    
    analytics: {
      getDeliveryStats: () => 
        api.get('messages/analytics/delivery-stats'),
      
      getFailureRates: () => 
        api.get('messages/analytics/failure-rates'),
    },
  },

  schedule: {
    create: (data: { 
      message: string, 
      scheduled_time: string, 
      recipient_type: 'single' | 'group', 
      recipient_id: string | number 
    }) => 
      api.post('schedule', data),
    
    getAll: () => 
      api.get('schedule'),
    
    getById: (id: number) => 
      api.get(`schedule/${id}`),
    
    update: (id: number, data: { message?: string, scheduled_time?: string }) => 
      api.put(`schedule/${id}`, data),
    
    delete: (id: number) => 
      api.delete(`schedule/${id}`),
    
    processDue: () => 
      api.post('schedule/process', {}),
  },

  contacts: {
    create: (data: { 
      phone_number: string, 
      first_name: string, 
      last_name: string, 
      email?: string 
    }) => 
      api.post('contacts', data),
    
    getAll: () => 
      api.get('contacts'),
    
    getById: (id: number) => 
      api.get(`contacts/${id}`),
    
    update: (id: number, data: any) => 
      api.put(`contacts/${id}`, data),
    
    delete: (id: number) => 
      api.delete(`contacts/${id}`),
  },

  groups: {
    create: (data: { name: string, description?: string }) => 
      api.post('groups', data),
    
    getAll: () => 
      api.get('groups'),
    
    getById: (id: number) => 
      api.get(`groups/${id}`),
    
    update: (id: number, data: { name?: string, description?: string }) => 
      api.put(`groups/${id}`, data),
    
    delete: (id: number) => 
      api.delete(`groups/${id}`),
      
    addContact: (groupId: number, contactId: number) => 
      api.post(`groups/${groupId}/contacts`, { contactIds: [contactId] }),
      
    addContacts: (groupId: number, contactIds: number[]) => 
      api.post(`groups/${groupId}/contacts`, { contactIds }),
      
    removeContact: (groupId: number, contactId: number) => 
      api.delete(`groups/${groupId}/contacts/${contactId}`),
      
    getContacts: (groupId: number) => 
      api.get(`groups/${groupId}/contacts`),
  },
  
  tags: {
    create: (name: string) => 
      api.post('tags', { name }),
    
    getAll: () => 
      api.get('tags'),
    
    delete: (id: number) => 
      api.delete(`tags/${id}`),
      
    // Contact tag management
    addToContact: (contactId: number, tagIds: number[]) => 
      api.post(`contacts/${contactId}/tags`, { tagIds }),
      
    removeFromContact: (contactId: number, tagId: number) => 
      api.delete(`contacts/${contactId}/tags/${tagId}`),
      
    getContactTags: (contactId: number) => 
      api.get(`contacts/${contactId}/tags`),
      
    // Group tag management
    addToGroup: (groupId: number, tagIds: number[]) => 
      api.post(`groups/${groupId}/tags`, { tagIds }),
      
    removeFromGroup: (groupId: number, tagId: number) => 
      api.delete(`groups/${groupId}/tags/${tagId}`),
      
    getGroupTags: (groupId: number) => 
      api.get(`groups/${groupId}/tags`),
  },

  templates: {
    create: (data: { name: string, content: string }) => 
      api.post('templates', data),
    
    getAll: () => 
      api.get('templates'),
    
    getById: (id: number) => 
      api.get(`templates/${id}`),
    
    update: (id: number, data: { name?: string, content?: string }) => 
      api.put(`templates/${id}`, data),
    
    delete: (id: number) => 
      api.delete(`templates/${id}`),
  },
  
  admin: {
    users: {
      getAll: () => 
        api.get('admin/users/all'),
        
      delete: (id: number) => 
        api.delete(`admin/users/${id}`),
        
      toggleStatus: (id: number, isActive: boolean) => 
        api.patch(`admin/users/${id}/status`, { is_active: isActive })
    }
  }
};
