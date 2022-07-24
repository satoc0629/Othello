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
    get: (row: number, col: number, getVisitor?: GetVisitor) => CellData | undefined
}



export interface GetVisitor {
    checkedCells: CellData[]
}

export class CellImpl implements CellData {
    row: number;
    col: number;
    exists: boolean;
    state: CellState;

    constructor(row: number, col: number, exists: boolean, state: CellState) {
        this.row = row;
        this.col = col;
        this.exists = exists;
        this.state = state;
    }

    /**
     * 対象の番地のセルを取得する。
     *
     * @param row
     * @param col
     * @param getVisitor 訪問者オブジェクト
     */
    public get(row: number, col: number, getVisitor?: GetVisitor): CellData | undefined {
        if (!getVisitor) {
            getVisitor = new class implements GetVisitor {
                checkedCells: CellData[] = []
            }();
        }
        // 既に探索済みならば、undefindを返す
        if (getVisitor.checkedCells.find(e => e.row === this.row && e.col === this.col)) {
            return undefined
        }
        getVisitor.checkedCells.push(this)
        if (this.row === row && this.col === col) {
            return this
        }

        return undefined
    }
}

