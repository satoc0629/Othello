import React, {PropsWithChildren} from "react";
import {CellData, CellState, GetVisitor} from "../types/CellData";

type Props = PropsWithChildren<CellData> & {
    onClick: () => Promise<void>
}

export const Cell = (props: Props) => {
    let value = ""
    switch (props.state) {
        case CellState.BLACK:
            value = "●"
            break
        case CellState.WHITE:
            value = "○"
            break
        default:
    }

    return <div style={{border: "solid 1px", textAlign: "center"}} onClick={props.onClick}>
        {props.exists ? value : "　"}
    </div>
}