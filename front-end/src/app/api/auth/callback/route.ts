import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const code = searchParams.get('code')
  const redirectTo = request.cookies.get('redirectTo')?.value

  const registerResponse = await api.post('/register', {
    code,
  })

  const { token } = registerResponse.data

  // console.log(token)
  const redirectURL = redirectTo ?? new URL('/', request.url)

  const cookieExpireTime = 60 * 60 * 24 * 10

  return NextResponse.redirect(redirectURL, {
    headers: {
      // eslint-disable-next-line prettier/prettier
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpireTime};`,
    },
  })
}
