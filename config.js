// لوحة التحكم منفصلة عن موقع المستخدمين، لكنها بتكلم نفس الخادم (Worker).
// لازم تضيف رابط اللوحة نفسه في متغير ALLOW في الـ Worker وإلا الخادم هيرفضها.
window.SIRB_CONFIG = Object.freeze({
  WORKER_URL: 'https://sirbai-api.mahmoudmomajeed.workers.dev'
});
