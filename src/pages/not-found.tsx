import { ArrowLeft } from "@untitledui/icons";
import { useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";

export function NotFound() {
    const router = useNavigate();

    return (
        <section className="kira-text-flow flex min-h-screen items-start bg-primary py-20 md:items-center md:py-28">
            <div className="mx-auto max-w-container grow px-5 md:px-10">
                <div className="flex w-full max-w-3xl flex-col gap-10 md:gap-12">
                    <div className="flex flex-col gap-5 md:gap-7">
                        <div className="flex flex-col gap-4">
                            <span className="text-md font-semibold text-brand-secondary">404 error</span>
                            <h1 className="text-display-md font-semibold text-primary md:text-display-lg lg:text-display-xl">We can’t find that page</h1>
                        </div>
                        <p className="text-lg text-tertiary md:text-xl">Sorry, the page you are looking for doesn't exist or has been moved.</p>
                    </div>

                    <div className="flex flex-col-reverse gap-4 sm:flex-row">
                        <Button color="secondary" size="xl" iconLeading={ArrowLeft} onClick={() => router(-1)}>
                            Go back
                        </Button>
                        <Button size="xl" onClick={() => router("/")}>
                            Take me home
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
