import { _decorator, Color, Component, EditBox, MeshRenderer, Node } from 'cc';
import { UserMgr } from '../../module_basic/scripts/UserMgr';
const { ccclass, property } = _decorator;

const LAST_NAMES = ['赵', '李', '张', '王', '姜', '刘', '孙', '吴', '上官', '欧阳', '百里', '武', '西门', '陈', '潘', '东方', '唐'];
const GIVEN_NAMES = ['天涯', '雪梨', '天天', '盼盼', '谋谋', '子轩', '童话', '子修', '婉儿', '松韵', '邱泽', '晨晨', '阳阳', '莎莎', '小小', '舞桐'];

@ccclass('CreateRoleScene')
export class CreateRoleScene extends Component {
    @property(MeshRenderer)
    playerMesh: MeshRenderer;

    @property(EditBox)
    edtInputName: EditBox;

    private _color: Color = null;
    onBtnRandomName() {
        let lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        let givenName = GIVEN_NAMES[Math.floor(Math.random() * GIVEN_NAMES.length)];
        this.edtInputName.string = lastName + givenName;
    }

    onBtnRandomColor() {
        this._color = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
        this.playerMesh.material.setProperty('mainColor', this._color);
    }

    async onBtnCreateRole() {
        let visualId = this._color.toRGBValue();
        let name = this.edtInputName.string;
        let ret = await UserMgr.inst.doCreateRole(name, visualId);
        if (!ret.isSucc) {
            return;
        }
        else if (ret.res.visualId) {
            //create role successfully, enter meta world
            //角色创建成功，进入场景
            UserMgr.inst.doEnterSubWorld(ret.res.subWorldId);
        }
    }

    start() {
        this.onBtnRandomColor();
        this.onBtnRandomName();
    }

    update(deltaTime: number) {

    }
}


