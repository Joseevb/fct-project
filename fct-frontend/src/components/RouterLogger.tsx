import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface RouterLoggerProps {
    componentName: string;
}

export default function RouterLogger({
    componentName,
}: Readonly<RouterLoggerProps>) {
    const location = useLocation();

    useEffect(() => {
        console.log(`Navigation caused by: ${componentName}`);
    }, [location, componentName]);

    return null;
}
