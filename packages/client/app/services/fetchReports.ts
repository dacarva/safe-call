import { FEEDBACK_ADDRESS } from './../../../contracts/constants';
import { ethers } from "ethers";
import {
	Feedback,
	Feedback__factory,
} from "../../../contracts/typechain-types";

const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_API_KEY
);
const feedback: Feedback = Feedback__factory.connect(
    FEEDBACK_ADDRESS,
    provider
);

export async function fetchReports() {
    try {
        const reports = [];
        const latestReportIndex = Number(await feedback.messageCounter());
        const roundFactor = 10 ** Number(await feedback.ROUND_FACTOR());
        for (let i = 1; i <= latestReportIndex; i++) {
            const message = await feedback.messageStore(i);
            const coordinatesRaw = await feedback.coordinatesStore(i);
            const coordinates = {
                TLX: Number(coordinatesRaw.TLX)/roundFactor,
                TLY: Number(coordinatesRaw.TLY)/roundFactor,
                TRX: Number(coordinatesRaw.TRX)/roundFactor,
                TRY: Number(coordinatesRaw.TRY)/roundFactor,
                BLX: Number(coordinatesRaw.BLX)/roundFactor,
                BLY: Number(coordinatesRaw.BLY)/roundFactor,
                BRX: Number(coordinatesRaw.BRX)/roundFactor,
                BRY: Number(coordinatesRaw.BRY)/roundFactor,
            };
            reports.push({
                message,
                coordinates,
            });
        }
        return reports;
    } catch (error) {
        console.error("Error fetching reports", error);
    }
}