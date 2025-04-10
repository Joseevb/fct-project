import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

export default function HomePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const handleDateSelection = () => {
        toast.success("Date saved: ", {
            description: `Date selected: ${date?.toLocaleDateString("es")}`,
            richColors: true,
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow"
                initialFocus
            />
            <Button onClick={handleDateSelection}>Click me</Button>
        </div>
    );
}
