import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    const {buttonIndex, inputText, userAddress, postURL} = body;

    const response = await fetch(postURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        untrustedData: {
          buttonIndex,
          inputText,
          userAddress,
          fid: userAddress,
        },
      }),
    });
    const res = await response.json();

    return new NextResponse(JSON.stringify(res), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({message: "Internal server error"}),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
export const GET = POST;
