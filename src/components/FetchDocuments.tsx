import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ScrollArea } from "./ui/scroll-area";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface OptionData {
    _id: string;
    INSTRUMENT: string;
    SYMBOL: string;
    EXPIRY_DT: string;
    STRIKE_PR: string;
    OPTION_TYP: string;
    OPEN: string;
    HIGH: string;
    LOW: string;
    CLOSE: string;
    SETTLE_PR: string;
    CONTRACTS: string;
    VAL_INLAKH: string;
    OPEN_INT: string;
    CHG_IN_OI: string;
    TIMESTAMP: string;
    __v: string;
}

const FetchDocuments: React.FC = () => {
    const [ceCloseAvgByTimestamp, setCeCloseAvgByTimestamp] = useState<
        { name: string; avgClose: number }[]
    >([]);

    const [peCloseAvgByTimestamp, setPeCloseAvgByTimestamp] = useState<
        { name: string; avgClose: number }[]
    >([]);

    const [ceChgInOiAvgByTimestamp, setCeChgInOiAvgByTimestamp] = useState<
        { name: string; avgChgInOi: number }[]
    >([]);

    const [peChgInOiAvgByTimestamp, setPeChgInOiAvgByTimesStamp] = useState<
        { name: string; avgChgInOi: number }[]
    >([]);

    const { collectionName, instrument } = useSelector(
        (state: RootState) => state.setNames
    );
    const { selectedDates } = useSelector(
        (state: RootState) => state.selectedDates
    );

    useEffect(() => {
        fetchDataFromApi();
    }, [selectedDates, collectionName, instrument]);

    const fetchDataFromApi = async () => {
        try {
            const response = await fetch("/api/fetchDocuments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    selectedDates,
                    instrument,
                    collectionName,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data: OptionData[] = await response.json();
            const ceData = data.filter(
                (obj: OptionData) => obj.OPTION_TYP === "CE" && parseFloat(obj.OPEN) > 0 && parseInt(obj.CHG_IN_OI) !== 0
            );
            const peData = data.filter(
                (obj: OptionData) => obj.OPTION_TYP === "PE" && parseFloat(obj.OPEN) > 0 && parseInt(obj.CHG_IN_OI) !== 0
            );

            console.log(ceData, peData);

            setCeCloseAvgByTimestamp(
                calculateCloseAverageByTimestamp(groupByCloseTimestamp(ceData))
            );
            setPeCloseAvgByTimestamp(
                calculateCloseAverageByTimestamp(groupByCloseTimestamp(peData))
            );
            setCeChgInOiAvgByTimestamp(
                calculateChgInOiAverageByTimestamp(groupByChgInOiTimestamp(ceData))
            );
            setPeChgInOiAvgByTimesStamp(
                calculateChgInOiAverageByTimestamp(groupByChgInOiTimestamp(peData))
            );
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const groupByCloseTimestamp = (data: OptionData[]) => {
        return data.reduce<{ [timestamp: string]: string[] }>(
            (acc, obj: OptionData) => {
                acc[obj.TIMESTAMP] = acc[obj.TIMESTAMP] || [];
                acc[obj.TIMESTAMP].push(obj.CLOSE);
                return acc;
            },
            {}
        );
    };
    const groupByChgInOiTimestamp = (data: OptionData[]) => {
        return data.reduce<{ [timestamp: string]: string[] }>(
            (acc, obj: OptionData) => {
                acc[obj.TIMESTAMP] = acc[obj.TIMESTAMP] || [];
                acc[obj.TIMESTAMP].push(obj.CHG_IN_OI);
                return acc;
            },
            {}
        );
    };

    const calculateCloseAverageByTimestamp = (dataByTimestamp: {
        [timestamp: string]: string[];
    }) => {
        const averageByTimestamp: {
            name: string;
            avgClose: number;
        }[] = [];
        for (const timestamp in dataByTimestamp) {
            const closeValues = dataByTimestamp[timestamp].map(parseFloat);
            const sumCloseValues = closeValues.reduce((acc, val) => acc + val, 0);
            const avgCloseValues = sumCloseValues / closeValues.length;
            averageByTimestamp.push({ name: timestamp, avgClose: avgCloseValues });
        }
        return averageByTimestamp;
    };
    const calculateChgInOiAverageByTimestamp = (dataByTimestamp: {
        [timestamp: string]: string[];
    }) => {
        const averageByTimestamp: {
            name: string;
            avgChgInOi: number;
        }[] = [];
        for (const timestamp in dataByTimestamp) {
            const chgInOiValues = dataByTimestamp[timestamp].map(parseFloat);
            const sumChgInOiValues = chgInOiValues.reduce((acc, val) => acc + val, 0);
            const avgChgInOiValues = sumChgInOiValues / chgInOiValues.length;
            averageByTimestamp.push({
                name: timestamp,
                avgChgInOi: avgChgInOiValues,

            });
        }
        return averageByTimestamp;
    };

    return (
        <ScrollArea className="w-full h-full">
            <div className="flex flex-row gap-2 justify-around items-center">
                <div className="flex flex-col">
                    <h2 className="text-sm font-bold">CE Options</h2>
                    <ResponsiveContainer width={600} height={400}>
                        <LineChart data={ceCloseAvgByTimestamp}>
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="name" fontSize={10} angle={-45} scale={"band"} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="avgClose"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />

                        </LineChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width={600} height={200}>
                        <LineChart data={ceChgInOiAvgByTimestamp}>
                            {/* <CartesianGrid strokeDasharray="3 3" syncWithTicks={true} /> */}
                            <XAxis dataKey="name" fontSize={10} angle={-45} scale={"band"} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="avgChgInOi"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />

                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-sm font-bold">PE Options</h2>
                    <ResponsiveContainer width={600} height={400}>
                        <LineChart data={peCloseAvgByTimestamp}>
                            {/* <CartesianGrid strokeDasharray="20 20" /> */}
                            <XAxis dataKey="name" fontSize={10} angle={-45} scale={"band"} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="avgClose"
                                stroke="#82ca9d"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width={600} height={200}>
                        <LineChart data={peChgInOiAvgByTimestamp}>
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="name" fontSize={10} angle={-45} scale={"band"} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="avgChgInOi"
                                stroke="#82ca9d"
                                activeDot={{ r: 8 }}
                            />

                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </ScrollArea>
    );
};

export default FetchDocuments;


// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store/store';
// import { ScrollArea } from './ui/scroll-area';
// import {
//     ComposedChart,
//     Line,
//     Area,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
// } from 'recharts';

// interface OptionData {
//     _id: string;
//     INSTRUMENT: string;
//     SYMBOL: string;
//     EXPIRY_DT: string;
//     STRIKE_PR: string;
//     OPTION_TYP: string;
//     OPEN: string;
//     HIGH: string;
//     LOW: string;
//     CLOSE: string;
//     SETTLE_PR: string;
//     CONTRACTS: string;
//     VAL_INLAKH: string;
//     OPEN_INT: string;
//     CHG_IN_OI: string;
//     TIMESTAMP: string;
//     __v: string;
// }

// const FetchDocuments: React.FC = () => {
//     const [ceCloseAvgByTimestamp, setCeCloseAvgByTimestamp] = useState<{ name: string; avgClose: number; avgChgInOI: number }[]>([]);
//     const [peCloseAvgByTimestamp, setPeCloseAvgByTimestamp] = useState<{ name: string; avgClose: number; avgChgInOI: number }[]>([]);

//     const { collectionName, instrument } = useSelector((state: RootState) => state.setNames);
//     const { selectedDates } = useSelector((state: RootState) => state.selectedDates);

//     useEffect(() => {
//         fetchDataFromApi();
//     }, [selectedDates, collectionName, instrument]);

//     const fetchDataFromApi = async () => {
//         try {
//             const response = await fetch('/api/fetchDocuments', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     selectedDates,
//                     instrument,
//                     collectionName,
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const data: OptionData[] = await response.json();
//             const ceData = data.filter((obj: OptionData) => obj.OPTION_TYP === 'CE' && parseFloat(obj.OPEN) > 0 && parseInt(obj.CHG_IN_OI) !== 0);
//             const peData = data.filter((obj: OptionData) => obj.OPTION_TYP === 'PE' && parseFloat(obj.OPEN) > 0 && parseInt(obj.CHG_IN_OI) !== 0);

//             const ceCloseAvgByTimestamp = calculateAverageByTimestamp(groupByTimestamp(ceData));
//             const peCloseAvgByTimestamp = calculateAverageByTimestamp(groupByTimestamp(peData));

//             const commonTimestamps = Object.keys(ceCloseAvgByTimestamp).filter(timestamp => peCloseAvgByTimestamp[timestamp]);

//             const combinedData = commonTimestamps.map(timestamp => ({
//                 name: timestamp,
//                 avgCloseCE: ceCloseAvgByTimestamp[timestamp].avgClose,
//                 avgClosePE: peCloseAvgByTimestamp[timestamp].avgClose,
//                 avgChgInOICE: ceCloseAvgByTimestamp[timestamp].avgChgInOI,
//                 avgChgInOIPE: peCloseAvgByTimestamp[timestamp].avgChgInOI,
//             }));

//             setCeCloseAvgByTimestamp(combinedData);
//             setPeCloseAvgByTimestamp(combinedData);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     const groupByTimestamp = (data: OptionData[]) => {
//         return data.reduce<{ [timestamp: string]: { avgClose: number; avgChgInOI: number } }>((acc, obj: OptionData) => {
//             acc[obj.TIMESTAMP] = acc[obj.TIMESTAMP] || { avgClose: 0, avgChgInOI: 0 };
//             acc[obj.TIMESTAMP].avgClose += parseFloat(obj.CLOSE);
//             acc[obj.TIMESTAMP].avgChgInOI += parseInt(obj.CHG_IN_OI);
//             return acc;
//         }, {});
//     };

//     const calculateAverageByTimestamp = (dataByTimestamp: { [timestamp: string]: { avgClose: number; avgChgInOI: number } }) => {
//         const averageByTimestamp: { [timestamp: string]: { avgClose: number; avgChgInOI: number } } = {};
//         for (const timestamp in dataByTimestamp) {
//             const numEntries = Object.keys(dataByTimestamp).length;
//             averageByTimestamp[timestamp] = {
//                 avgClose: dataByTimestamp[timestamp].avgClose / numEntries,
//                 avgChgInOI: dataByTimestamp[timestamp].avgChgInOI / numEntries,
//             };
//         }
//         return averageByTimestamp;
//     };

//     return (
//         <ScrollArea className='w-full h-full items'>
//             <div className='flex flex-row gap-2 items-center'>
//                 <div className='flex flex-col'>
//                     <h2>CE Options</h2>
//                     <ResponsiveContainer width={450} height={400}>
//                         <ComposedChart data={ceCloseAvgByTimestamp}>
//                             <CartesianGrid strokeDasharray='3 3' />
//                             <XAxis dataKey='name' fontSize={10} angle={-45} />
//                             <YAxis />
//                             <YAxis yAxisId='right' orientation='right' />
//                             <Tooltip />
//                             <Legend />
//                             <Area type='monotone' dataKey='avgCloseCE' fill='#8884d8' stroke='#8884d8' name='CE Close' />
//                             <Line type='monotone' dataKey='avgCloseCE' stroke='#8884d8' name='CE Close' />
//                             <Bar dataKey='avgChgInOICE' barSize={20} fill='#413ea0' yAxisId='right' name='CE CHG_IN_OI' />
//                         </ComposedChart>
//                     </ResponsiveContainer>
//                 </div>
//                 <div className='flex flex-col'>
//                     <h2>PE Options</h2>
//                     <ResponsiveContainer width={450} height={400}>
//                         <ComposedChart data={peCloseAvgByTimestamp}>
//                             <CartesianGrid strokeDasharray='3 3' />
//                             <XAxis dataKey='name' fontSize={10} angle={-45} />
//                             {/* <YAxis /> */}
//                             <YAxis yAxisId='right' orientation='right' />
//                             <Tooltip />
//                             <Legend />
//                             <Area type='monotone' dataKey='avgClosePE' fill='#82ca9d' stroke='#82ca9d' name='PE Close' />
//                             <Line type='monotone' dataKey='avgClosePE' stroke='#82ca9d' name='PE Close' />
//                             <Bar dataKey='avgChgInOIPE' barSize={20} fill='#FFA500' yAxisId='right' name='PE CHG_IN_OI' />
//                         </ComposedChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         </ScrollArea>
//     );
// };

// export default FetchDocuments;
