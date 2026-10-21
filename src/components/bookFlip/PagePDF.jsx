import React, { useMemo } from 'react';
import { Page } from 'react-pdf'; // Sesuaikan jika nama import Page berbeda

const PagePDF = React?.memo(
    React?.forwardRef((props, ref) => {
        const searchRegex = useMemo(() => {
            const query = props.searchQuery?.trim();
            return query
                ? new RegExp(
                    `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
                    'gi'
                )
                : null;
        }, [props.searchQuery]);
        
        const textRenderer = useMemo(() => {
            if (!searchRegex) return undefined;

            return ({ str }) => {
                if (!str) return '';
                searchRegex.lastIndex = 0;
                return str.replace(
                    searchRegex,
                    '<mark class="text-yellow-400">$&</mark>'
                );
            };
        }, [searchRegex]);

        if (!props.number) return null;

        if (!props.isVisible) {
            return (
                <div
                    ref={ref}
                    className="bg-white"
                    style={{ width: props.width, height: props.height }}
                />
            );
        }

        if (!props.isVisible) {
            return (
                <div
                    ref={ref}
                    className="bg-white"
                    style={{ width: props.width, height: props.height }}
                />
            );
        }

        return (
            <div ref={ref} className="relative m-0 p-0 overflow-hidden bg-white"
            style={{
                width: props.width,
                height: props.height,
                opacity: props.hasSearchQuery && !props.isTargetPage
                    ? 0.3 : 1
            }}
            >
                <Page
                pageNumber={props?.number}
                width={props?.width}
                renderMode="canvas"
                renderAnnotationLayer={false}
                renderTextLayer={!!props.searchQuery}
                customTextRenderer={textRenderer}
                devicePixelRatio={1.5}
                _className="block m-0 p-0"
                />
            </div>
        );
    }),
    (prev, next) =>
        prev.number === next.number &&
        prev.width === next.width &&
        prev.height === next.height &&
        prev.isVisible === next.isVisible &&
        prev.searchQuery === next.searchQuery &&
        prev.hasSearchQuery === next.hasSearchQuery &&
        prev.isTargetPage === next.isTargetPage
);

export default PagePDF;