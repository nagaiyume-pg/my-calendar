import React from "react";

/**
 * 複数の ref を1つの ref にまとめるカスタムフック。
 * 複数の参照を管理したい場合に便利です。
 *
 * @param {...React.Ref<any>[]} refs 複数の ref を指定できます。関数型の ref またはオブジェクト型の ref を渡すことができます。
 * @returns {React.RefObject<any>} ターゲットとなる DOM 要素またはコンポーネントへの参照を保持する ref。
 *
 * @example
 * ```tsx
 * const ref1 = React.useRef(null);
 * const ref2 = React.useRef(null);
 * const combinedRef = useCombinedRefs(ref1, ref2);
 *
 * return <div ref={combinedRef}>Hello World</div>;
 * ```
 */
export const useCombinedRefs = (...refs: React.Ref<any>[]) => {
    // ターゲットとなる DOM 要素の参照を保持するための ref を作成
    const targetRef = React.useRef();

    // refs が変更されるたびに実行されるエフェクト
    React.useEffect(() => {
        // 渡されたすべての ref に対して処理を実行
        refs.forEach(ref => {
            if (!ref) {
                return; // ref が渡されていない場合は処理をスキップ
            }

            // ref が関数型のコールバック ref かどうかを確認
            if (typeof ref === 'function') {
                // 関数型の ref の場合、targetRef.current を引数として関数を呼び出す
                ref(targetRef.current);
            } else {
                // オブジェクト型の ref の場合、targetRef.current を ref.current に設定
                // @ts-expect-error: ref が React.RefObject として定義されていない場合の型エラーを無視
                ref.current = targetRef.current;
            }
        });
    }, [refs]); // refs 配列が変更されるたびにエフェクトを再実行

    // ターゲットの ref を返す。これを JSX 内の DOM 要素に渡す
    return targetRef;
};
