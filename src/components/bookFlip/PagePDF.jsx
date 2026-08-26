import React, { useMemo } from "react";
import { Page } from "react-pdf";

const PagePDF = React?.memo(
    React?.forwardRef((props, ref) => {
        if (!props?.number) {
            return null;
        }

        const searchRegex = useMemo(() => {
            if (!props?.searchQuery?.trim()) {
                return null;
            }
            const query = props.searchQuery.trim();
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
            return new RegExp(`(${escapedQuery})`, 'gi');
        }, [props?.searchQuery]);
        
        const textRenderer = useMemo(() => {
            if (!searchRegex) {
                return undefined;
            }
            return (textItem) => {
                if (!textItem?.str) {
                    return '';
                }
                return textItem.str.replace(searchRegex, (match) => {
                        return `<mark class="text-yellow-400">${match}</mark>`;
                    }
                );
            };
        }, [searchRegex]);

        if (props?.isVisible === false) {
            return (
                <div
                ref={ref}
                style={{
                    width: props?.width,
                    height: props?.width * 1.414
                }}
                className="bg-white"
                />
            );
        }

        return (
            <div ref={ref} className="relative m-0 p-0 overflow-hidden"
            style={{
                width: props?.width,
                opacity: props?.hasSearchQuery ? props?.isTargetPage ? 1 : 0.3 : 1
            }}
            >
                <Page
                pageNumber={props?.number}
                width={props?.width}
                _className="block m-0 p-0"
                renderAnnotationLayer={false}
                renderTextLayer={Boolean(props?.searchQuery)}
                customTextRenderer={textRenderer}
                />
            </div>
        );
    })
);

export default PagePDF