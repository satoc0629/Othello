import {Turn} from "./Turn";

export enum CellState {
    WHITE,
    BLACK,
    NONE
}

export interface CellData {
    col: number
    row: number
    exists: boolean
    state: CellState
    cell_1?: CellData
    cell_2?: CellData
    cell_3?: CellData
    cell_4?: CellData
    cell_6?: CellData
    cell_7?: CellData
    cell_8?: CellData
    cell_9?: CellData

    availableSet(direction: DirectionType, row: number, col: number): boolean

    get(row: number, col: number, getVisitor?: GetVisitor): CellData | undefined
}

export type DirectionType = 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9

export interface DirectionCheckRequest {
    state: CellState
    direction: DirectionType
    certificatedCells: CellData[]
}

export interface GetVisitor {
    checkedCells: CellData[]
}

export class CellImpl implements CellData {
    cell_1?: CellData;
    cell_2?: CellData;
    cell_3?: CellData;
    cell_4?: CellData;
    cell_6?: CellData;
    cell_7?: CellData;
    cell_8?: CellData;
    cell_9?: CellData;
    row: number;
    col: number;
    exists: boolean;
    state: CellState;

    constructor(row: number, col: number, exists: boolean, state: CellState, cell_1?: CellData, cell_2?: CellData, cell_3?: CellData, cell_4?: CellData, cell_6?: CellData, cell_7?: CellData, cell_8?: CellData, cell_9?: CellData) {
        this.cell_1 = cell_1;
        this.cell_2 = cell_2;
        this.cell_3 = cell_3;
        this.cell_4 = cell_4;
        this.cell_6 = cell_6;
        this.cell_7 = cell_7;
        this.cell_8 = cell_8;
        this.cell_9 = cell_9;
        this.row = row;
        this.col = col;
        this.exists = exists;
        this.state = state;
    }

    private check(direction: DirectionType, turn :Turn):object {
        switch (direction) {
            case 1:
                break
            case 2:
                if (!this.cell_2) {
                    return false
                }
                return this.cell_2.state != turn ? this.check(direction, turn): false
        }
    }
    public check(turn: Turn): object {
        return {}
    }

    public get(row: number, col: number, getVisitor?: GetVisitor): CellData | undefined {
        if (!getVisitor) {
            getVisitor = new class implements GetVisitor {
                checkedCells: CellData[] = []
            }
        }
        // 既に探索済みならば、undefindを返す
        if (getVisitor.checkedCells.find(e => e.row === this.row && e.col === this.col)) {
            return undefined
        }
        getVisitor.checkedCells.push(this)
        if (this.row === row && this.col === col) {
            return this
        }

        if (this.col === col) {
            // 垂直方向への探索を行う
            const rowMinus1 = this.cell_2?.get(row, col, getVisitor)
            if (rowMinus1) {
                return rowMinus1
            }
            const rowPlus1 = this.cell_8?.get(row, col, getVisitor)
            if (rowPlus1) {
                return rowPlus1
            }
        }

        if (this.row === row) {
            // 水平方向への探索を行う
            const colMinus1 = this.cell_4?.get(row, col, getVisitor)
            if (colMinus1) {
                return colMinus1
            }
            const colPlus1 = this.cell_6?.get(row, col, getVisitor)
            if (colPlus1) {
                return colPlus1
            }
        }

        // 上記以外の1,3,7,9方向の探索が必要
        // 場合によっては再帰が必要
        const getDirection1 = this.cell_1?.get(row, col, getVisitor)
        if (getDirection1) {
            return getDirection1
        }
        const getDirection3 = this.cell_3?.get(row, col, getVisitor)
        if (getDirection3) {
            return getDirection3
        }
        const getDirection7 = this.cell_7?.get(row, col, getVisitor)
        if (getDirection7) {
            return getDirection7
        }
        const getDirection9 = this.cell_9?.get(row, col, getVisitor)
        if (getDirection9) {
            return getDirection9
        }

        return undefined
    }

    public availableSet(direction: DirectionType, row: number, col: number): boolean {
        switch (direction) {
            case 1:
                this.cell_1?.availableSet(1, row, col)
        }
        return true
    }
}

