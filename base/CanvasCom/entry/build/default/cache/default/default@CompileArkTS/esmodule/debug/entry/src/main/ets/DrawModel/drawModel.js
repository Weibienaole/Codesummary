import CommonConstants from '@bundle:com.example.canvascom/entry/ets/constants/index';
import FillArcData from '@bundle:com.example.canvascom/entry/ets/DrawModel/type';
const AVG_ITEM_COLORS = ['#FFC6BD', '#FFEC90', '#ECF9C7', '#FFC6BD', '#FFEC90', '#ECF9C7'];
const AVG_ITEM_COUNT = 6;
const SMALL_CIRCLE_COUNT = 8;
export default class DrawModel {
    constructor() {
        this.avgAngle = 360 / AVG_ITEM_COUNT;
        this.startAngle = 0;
    }
    draw(canvasContext, screenWidth, screenHeight) {
        if ([undefined, null, ''].includes(canvasContext)) {
            console.error('no context');
            return;
        }
        this.canvasContext = canvasContext;
        this.screenWidth = screenWidth;
        // 绘制前先清理这个区域
        this.canvasContext.clearRect(0, 0, this.screenWidth, screenHeight);
        // 沿x，y平移
        this.canvasContext.translate(this.screenWidth / 2, screenHeight / 2);
        this.drawFlower();
        this.drawOutCircle();
        this.drawInnerCircle();
        this.drawInnerArc();
        this.drawArcText();
        this.drawImage();
        this.canvasContext.translate(-this.screenWidth / 2, -screenHeight / 2);
    }
    // 绘制外部圆盘的花瓣
    drawFlower() {
        let beginAngle = this.startAngle + this.avgAngle;
        const pointY = this.screenWidth * .255;
        const radius = this.screenWidth * .217;
        const innerRadius = this.screenWidth * .193;
        for (let i = 0; i < AVG_ITEM_COUNT; i++) {
            this.canvasContext.save();
            this.canvasContext.rotate(beginAngle * Math.PI / 180);
            this.fillArc(new FillArcData(0, -pointY, radius, 0, Math.PI * 2), '#ED6E21');
            this.fillArc(new FillArcData(0, -pointY, innerRadius, 0, Math.PI * 2), '#F8A01E');
            beginAngle += this.avgAngle;
            this.canvasContext.restore();
        }
    }
    // 绘制外部圆盘以及圆圈
    drawOutCircle() {
        this.fillArc(new FillArcData(0, 0, this.screenWidth * .4, 0, Math.PI * 2), '#F7CD03');
        let beginAngle = this.startAngle;
        // 绘制小圆点
        for (let i = 0; i < SMALL_CIRCLE_COUNT; i++) {
            this.canvasContext.save();
            this.canvasContext.rotate(beginAngle * Math.PI / 180);
            // 分别绘制每份的区域
            this.fillArc(new FillArcData(this.screenWidth * .378, 0, 4.1, 0, Math.PI * 2), '#FFFFFF');
            beginAngle = beginAngle + 360 / SMALL_CIRCLE_COUNT;
            this.canvasContext.restore();
        }
    }
    // 画内部圆盘
    drawInnerCircle() {
        this.fillArc(new FillArcData(0, 0, this.screenWidth * 0.356, 0, Math.PI * 2), '#F8A01E');
        this.fillArc(new FillArcData(0, 0, this.screenWidth * 0.339, 0, Math.PI * 2), '#FFFFFF');
    }
    // 画内部扇形抽奖区域
    drawInnerArc() {
        const radius = this.screenWidth * .336;
        for (let i = 0; i < AVG_ITEM_COUNT; i++) {
            this.fillArc(
            // 每份平均绘制，start --- start + angle
            new FillArcData(0, 0, radius, this.startAngle * Math.PI / 180, (this.startAngle + this.avgAngle) * Math.PI / 180), AVG_ITEM_COLORS[i]);
            this.canvasContext.lineTo(0, 0);
            this.canvasContext.fill();
            this.startAngle += this.avgAngle;
        }
    }
    // 画内部扇形区的文字
    drawArcText() {
        this.canvasContext.textAlign = 'center';
        this.canvasContext.textBaseline = 'middle';
        this.canvasContext.fillStyle = '#ED6E21';
        this.canvasContext.font = fp2px(14) + 'px sans-serif';
        const textArrays = [
            { "id": 16777230, "type": 10003, params: [], "bundleName": "com.example.canvascom", "moduleName": "entry" },
            { "id": 16777229, "type": 10003, params: [], "bundleName": "com.example.canvascom", "moduleName": "entry" },
            { "id": 16777227, "type": 10003, params: [], "bundleName": "com.example.canvascom", "moduleName": "entry" },
            { "id": 16777230, "type": 10003, params: [], "bundleName": "com.example.canvascom", "moduleName": "entry" },
            { "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.canvascom", "moduleName": "entry" },
            { "id": 16777231, "type": 10003, params: [], "bundleName": "com.example.canvascom", "moduleName": "entry" }
        ];
        for (let i = 0; i < AVG_ITEM_COUNT; i++) {
            this.drawCircularText(this.getResourceString(textArrays[i]), (this.startAngle + 34) * Math.PI / 180, (this.startAngle + 26) * Math.PI / 180);
            this.startAngle += this.avgAngle;
        }
    }
    // 获取resource内容
    getResourceString(resource) {
        if (!resource) {
            return '';
        }
        let resourceString = '';
        try {
            console.log(JSON.stringify(resource), resource);
            resourceString = getContext(this).resourceManager.getStringSync(resource.id);
        }
        catch (_a) {
        }
        return resourceString;
    }
    // 绘制Text
    drawCircularText(textString, startAngle, endAngle) {
        class CircleText {
        }
        const circleText = {
            x: 0,
            y: 0,
            radius: this.screenWidth * .336
        };
        const radius = circleText.radius - circleText.radius / AVG_ITEM_COUNT;
        // 每个字母的弧度
        const angleDecrement = (startAngle - endAngle) / (textString.length - 1);
        let angle = startAngle, index = 0, character;
        // 循环将每个字母以正确的角度显示
        while (index < textString.length) {
            character = textString.charAt(index);
            this.canvasContext.save();
            this.canvasContext.beginPath();
            this.canvasContext.translate(circleText.x + Math.cos(angle) * radius, circleText.y - Math.sin(angle) * radius);
            this.canvasContext.rotate(Math.PI / 2 - angle);
            this.canvasContext.fillText(character, 0, 0);
            angle -= angleDecrement;
            index++;
            this.canvasContext.restore();
        }
    }
    // 画内部扇区奖品以及对应的图片
    drawImage() {
        var _a, _b, _c, _d;
        let beginAngle = this.startAngle;
        let imageSrc = [
            CommonConstants.WATERMELON_IMAGE_URL, CommonConstants.BEER_IMAGE_URL,
            CommonConstants.SMILE_IMAGE_URL, CommonConstants.CAKE_IMAGE_URL,
            CommonConstants.HAMBURG_IMAGE_URL, CommonConstants.SMILE_IMAGE_URL
        ];
        for (let i = 0; i < AVG_ITEM_COUNT; i++) {
            let image = new ImageBitmap(imageSrc[i]);
            (_a = this.canvasContext) === null || _a === void 0 ? void 0 : _a.save();
            (_b = this.canvasContext) === null || _b === void 0 ? void 0 : _b.rotate(beginAngle * Math.PI / 180);
            (_c = this.canvasContext) === null || _c === void 0 ? void 0 : _c.drawImage(image, this.screenWidth * .114, this.screenWidth * 0.052, 40, 40);
            beginAngle += this.avgAngle;
            (_d = this.canvasContext) === null || _d === void 0 ? void 0 : _d.restore();
        }
    }
    // 绘制弧形
    fillArc(fillArcData, fillColor) {
        if (this.canvasContext !== undefined) {
            this.canvasContext.beginPath();
            this.canvasContext.fillStyle = fillColor;
            this.canvasContext.arc(fillArcData.x, fillArcData.y, fillArcData.radius, fillArcData.startAngle, fillArcData.endAngle);
            this.canvasContext.fill();
        }
    }
}
//# sourceMappingURL=drawModel.js.map