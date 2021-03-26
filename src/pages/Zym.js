import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Checkbox, Card, Row, Col } from 'antd';
export default class Zym extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            /**
             * 交易代码
             */
            tradeCode: [],
            /**
             * 交易要素
             */
            tradeElement: [],
            /**
             * 当前交易代码
             */
            currentTradeCode: '',
            /**
             * 已选
             */
            selected: [],
        };
    }
    componentDidMount() {
        fetch('/getTradeCode')
            .then((resJson) => resJson.json())
            .then((res) => {
            const tradeCode = res.map((item) => {
                return {
                    ...item,
                    checked: false,
                };
            });
            console.log(tradeCode);
            this.setState({
                tradeCode,
            });
        });
    }
    /**
     * 点击交易要素时的回调
     * @param e         事件
     * @param tradeCode 交易代码
     */
    onClickTradeCode(e, tradeCode) {
        fetch('/getTradeElement?tradeCode=' + tradeCode)
            .then((resJson) => resJson.json())
            .then((res) => {
            const tradeCodeItem = this.state.tradeCode.find((item) => {
                return item.code === tradeCode;
            });
            tradeCodeItem.children = res;
            this.setState({
                currentTradeCode: tradeCode,
                // tradeElement: tradeCodeItem,
            });
        });
    }
    /**
     * 交易要素发生变化时的回调
     * @param e
     */
    onChangeTradeElement(e) {
        console.log(e);
        const checked = e.target.checked;
        const tradeCode = this.state.selected.find(item => item.code === this.state.currentTradeCode);
        if (checked) {
            if (tradeCode) {
            }
            else {
            }
        }
    }
    render() {
        const { currentTradeCode, tradeCode, tradeElement } = this.state;
        return (_jsxs(Row, Object.assign({ gutter: 16 }, { children: [_jsx(Col, Object.assign({ span: 4, offset: 6 }, { children: _jsx(Card, Object.assign({ size: 'small', title: '\u4EA4\u6613\u4EE3\u7801', style: { height: 200 } }, { children: this.state.tradeCode.map((item) => {
                            return (_jsxs("section", { children: [_jsx(Checkbox, { checked: false, disabled: true }, void 0),
                                    _jsx("span", Object.assign({ style: {
                                            marginLeft: 8,
                                            cursor: 'pointer',
                                        }, onClick: (e) => this.onClickTradeCode(e, item.code) }, { children: item.code }), void 0)] }, item.code));
                        }) }), void 0) }), void 0),
                _jsx(Col, Object.assign({ span: 4 }, { children: _jsx(Card, Object.assign({ size: 'small', title: '\u4EA4\u6613\u8981\u7D20', style: { height: 200 } }, { children: tradeCode
                            .find((item) => item.code === currentTradeCode)
                            ?.children.map((item) => {
                            return (_jsxs(_Fragment, { children: [_jsx(Checkbox, Object.assign({ onChange: (e) => this.onChangeTradeElement(e) }, { children: item.element }), item.element),
                                    _jsx("br", {}, void 0)] }, void 0));
                        }) }), void 0) }), void 0),
                _jsx(Col, Object.assign({ span: 4 }, { children: _jsxs(Card, Object.assign({ size: 'small', title: '\u5DF2\u9009', style: { height: 200 } }, { children: [_jsx("p", { children: "Card content" }, void 0),
                            _jsx("p", { children: "Card content" }, void 0),
                            _jsx("p", { children: "Card content" }, void 0)] }), void 0) }), void 0)] }), void 0));
    }
}
//# sourceMappingURL=Zym.js.map