import { useEffect, RefObject } from 'react';

export const useInfiniteScroll = (
  loadMoreRef: RefObject<HTMLDivElement | null>,
  loading: boolean,
  hasMore: boolean,
  onLoadMore: () => void
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, hasMore, loadMoreRef, onLoadMore]);
};
