export default function Heading({currentMonth, currentYear}: {currentMonth: string, currentYear: number}) {
    return (<span className="text-1.5xl w-50">{currentMonth}, {currentYear}</span>);
}