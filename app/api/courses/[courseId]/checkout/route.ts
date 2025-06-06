// import { db } from "@/lib/db";
// import { stripe } from "@/lib/stripe";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// export async function POST(
//     req: Request,
//     { params }: { params: Promise<{ courseId: string }> }
// ) {
//     try {
//         const { courseId } = await params;
//         const user = await currentUser();

//         if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         const course = await db.course.findUnique({
//             where: {
//                 id: courseId,
//                 isPublished: true,
//             }                                   
//         });

//         const purchase = await db.purchase.findUnique({
//             where: {
//                 userId_courseId: {
//                     userId: user.id,
//                     courseId: courseId,
//                 }
//             }
//         });

//         if (purchase) {
//             return new NextResponse("Already purchased", { status: 400 });
//         }

//         if (!course) {
//             return new NextResponse("Not found", { status: 404 });
//         }

//         const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
//             {
//                 quantity: 1,
//                 price_data: {
//                     currency: "USD",
//                     product_data: {
//                         name: course.title,
//                         description: course.description!,
//                     },
//                     unit_amount: Math.round(course.price! * 100),
//                 }
//             }
//         ];

//         let stripeCustomer = await db.stripeCustomer.findUnique({
//             where: {
//                 userId: user.id,
//             },
//             select: {
//                 stripeCustomerId: true
//             }
//         });

//         if (!stripeCustomer) {
//             const customer = await stripe.customers.create({
//                 email: user.emailAddresses[0].emailAddress,
//             });

//             stripeCustomer = await db.stripeCustomer.create({
//                 data: {
//                     userId: user.id,
//                     stripeCustomerId: customer.id
//                 }
//             });
//         }

//         const session = await stripe.checkout.sessions.create({
//             customer: stripeCustomer.stripeCustomerId,
//             line_items,
//             mode:'payment',
//             success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
//             cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
//             metadata: {
//                 courseId: course.id,
//                 userId: user.id,
//             }
//         });

//         return NextResponse.json({ url: session.url });
        
//     } catch (error) {
//         console.log("[COURSE_ID_CHECKOUT]", error);
//         return new NextResponse("Internal error", { status: 500 });
//     }
// };


import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            },
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        if (!course.price) {
            return new NextResponse("Course price missing", { status: 400 });
        }

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId,
                },
            },
        });

        if (purchase) {
            return new NextResponse("Already purchased", { status: 400 });
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.title,
                        description: course.description || "No description available",
                    },
                    unit_amount: Math.round(course.price * 100),
                },
            },
        ];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                stripeCustomerId: true,
            },
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            });

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                },
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
            metadata: {
                courseId,
                userId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
