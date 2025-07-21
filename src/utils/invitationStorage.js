export const invitationStorage = {
  setToken: (token) => sessionStorage.setItem('pending_invitation', token),
  getToken: () => sessionStorage.getItem('pending_invitation'),
  clearToken: () => sessionStorage.removeItem('pending_invitation')
}; 