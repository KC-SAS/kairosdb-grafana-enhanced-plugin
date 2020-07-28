import { KairosDBQueryCtrl } from "../../core/query_ctrl";
import { TemplatingUtils } from "../../utils/templating_utils";
import {KairosDBAnnotationsQueryCtrl} from "../../core/annotations_query_ctrl";
import {KairosDBQueryCtrlBase} from "../../core/query_ctrl_base";

export interface Template {
    /**
     * Refresh the template values
     * @param controler the controler instance
     */
    refresh(controler: KairosDBQueryCtrlBase);
}
