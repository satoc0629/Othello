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

    return <div style={{
        border: "solid 1px",
        fontSize: "48px", display: "flex",
        alignItems: "center"
    }} onClick={props.onClick}>
        <div style={{width: "100%", textAlign: "center"}}>
            {props.exists ? value : "　"}
        </div>
    </div>
}