import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

type ScrollableXProps = {
    children: React.ReactNode;
};

const scrollDiv = (container: HTMLDivElement, direction: 'left' | 'right') => {
    if (container) {
        container.scrollLeft += direction === 'left' ? -200 : 200;
    }
}

const ScrollableX = ({ children }: ScrollableXProps) => {
    const scrollContainer = useRef<HTMLDivElement>(null);

    return <div className={`flex flex-row gap-2 place-items-center`}>
        <ArrowLeft onClick={
            () => scrollContainer.current && scrollDiv(scrollContainer.current, 'left')
        } />
        <div ref={scrollContainer} className={`overflow-x-hidden rounded-lg scroll-x scroll-smooth`}>
            {children}
        </div>
        <ArrowRight
            onClick={() => scrollContainer.current && scrollDiv(scrollContainer.current, 'right')}
        />
    </div>
};

export default ScrollableX;