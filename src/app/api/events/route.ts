import configPromise from "@payload-config";
import { getPayload } from "payload";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const payload = await getPayload({ config: configPromise });

    const { user } = await payload.auth({ headers: req.headers });
    if (!user) {
        return NextResponse.json(
            { message: "Unauthorized access. Please log in." },
            { status: 401 }
        );
    }


    const now = new Date();

    const [seminars, webinars] = await Promise.all([
        payload.find({ collection: "seminars", depth: 0 }),
        payload.find({ collection: "webinars", depth: 0 }),
    ]);

    const events: any[] = [];

    // Seminars
    seminars.docs.forEach((seminar: any) => {
        seminar.dates?.forEach((date: any) => {
            if (new Date(date.startDate) > now) {
                events.push({
                    title: seminar.title,
                    startDate: date.startDate,
                    endDate: date.endDate,
                    doc: {
                        relationTo: "seminars",
                        value: seminar.id,
                    },
                });
            }
        });
    });

    // Webinars
    webinars.docs.forEach((webinar: any) => {
        webinar.dates?.forEach((date: any) => {
            if (new Date(date.startDate) > now) {
                events.push({
                    title: webinar.title,
                    startDate: date.startDate,
                    endDate: date.endDate,
                    doc: {
                        relationTo: "webinars",
                        value: webinar.id,
                    },
                });
            }
        });
    });

    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return NextResponse.json(events);
};
