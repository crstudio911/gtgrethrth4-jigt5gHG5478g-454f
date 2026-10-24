// لوحة التحكم بتكلم نفس سيرفرات الموقع. لازم تضيف رابط اللوحة في متغير ALLOW في كل سيرفر.
// سيرفرات الموقع بالترتيب: الأول هو الأساسي، واللي بعده احتياطي.
// كل السيرفرات لازم يكون فيها نفس الـ worker.js ونفس المتغيرات (SHET_URL و SECRIT و ALLOW ...).
window.SIRB_CONFIG = Object.freeze({
  WORKER_URLS: [
    'https://sirbai-api.mahmoudmomajeed.workers.dev',
    'https://sirbai-api2.7oka12345678910.workers.dev'
  ]
});
