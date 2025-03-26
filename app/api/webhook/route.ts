// import Stripe from "stripe";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";

// import { stripe } from "@/lib/stripe";
// import { db } from "@/lib/db";

// export async function POST(req: Request) {
//     const body = await req.text();
//     const signature = (await headers()).get("Stripe-Signature") as string;

//     let event: Stripe.Event;

//     try {
//         event = stripe.webhooks.constructEvent(
//             body,
//             signature,
//             process.env.STRIPE_WEBHOOK_SECRET!
//         )
        
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//         return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
//     }

//     const session = event.data.object as Stripe.Checkout.Session;
//     const userId = session?.metadata?.userId;
//     const courseId = session?.metadata?.courseId;

//     if (event.type === "checkout.session.completed") {
//         if (!userId || !courseId) {
//             return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
//         }

//         await db.purchase.create({
//             data: {
//                 courseId: courseId,
//                 userId: userId
//             }
//         });
//     } else {
//         return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
//     }

//     return new NextResponse(null, { status: 200 });
// }

import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("[WEBHOOK_VERIFY_ERROR]", error);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            console.error("[WEBHOOK_METADATA_MISSING]", { eventId: event.id });
            return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
        }

        const existingPurchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existingPurchase) {
            console.log("[WEBHOOK_DUPLICATE_PURCHASE]", { userId, courseId });
            return new NextResponse(null, { status: 200 });
        }

        await db.purchase.create({
            data: {
                courseId,
                userId,
            },
        });
        console.log("[WEBHOOK_PURCHASE_CREATED]", { userId, courseId });
    } else {
        console.log("[WEBHOOK_UNHANDLED_EVENT]", { type: event.type, eventId: event.id });
    }

    return new NextResponse(null, { status: 200 });
}