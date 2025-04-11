interface AboutPageProps {
    id: string;
}

export default function AboutPage({ id }: AboutPageProps) {
    return (
        <section className="min-h-dvh" id={id}>
            <h2>About</h2>
        </section>
    );
}
