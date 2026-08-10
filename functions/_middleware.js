export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Redirect all requests to ceased page
  if (url.pathname !== '/ceased') {
    return Response.redirect(`${url.origin}/ceased`, 301);
  }
  
  // Continue to the ceased page
  return context.next();
}
