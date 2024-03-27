import { NextResponse, type NextRequest } from "next/server"

const UNPROTECTED_PATHS = ["/", "/auth/callback"]

export async function middleware(request: NextRequest) {
  // 创建一个未修改的响应
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 检查用户是否登录
  const accessToken = request.cookies.get("token")
  const isLoggedIn = !!accessToken

  // 如果用户未登录且访问的是受保护页面，则重定向到 /
  if (!isLoggedIn && !UNPROTECTED_PATHS.includes(request.nextUrl.pathname)) {
    console.debug("用户未登录，重定向到 /")
    const redirectUrl = new URL("/", request.nextUrl.origin)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/status",
  ],
}
