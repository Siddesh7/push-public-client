import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    const {buttonIndex, inputText, userAddress, postURL} = body;
    console.log("Button index:", buttonIndex);
    console.log("Input text:", inputText);
    console.log("User address:", userAddress);
    console.log("Post URL:", postURL);
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
    const htmlContent = await response.text(); // Get the HTML content as text

    return new NextResponse(JSON.stringify({data: htmlContent}), {
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
