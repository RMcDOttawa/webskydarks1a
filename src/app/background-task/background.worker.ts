//noinspection
/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  console.log('background worker message event listener received: ', data);
  postMessage(response);
});

addEventListener('error', (error) => {
  console.log('background worker error event listener received: ', error);
});

addEventListener('messageerror', (error) => {
  console.log('background worker messageerror event listener received: ', error);
});

addEventListener('rejectionhandled', (error) => {
  console.log('background worker rejectionhandled event listener received: ', error);
});

addEventListener('unhandledrejection', (error) => {
  console.log('background worker unhandledrejection event listener received: ', error);
});
