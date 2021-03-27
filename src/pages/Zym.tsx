import React from 'react';
import { cloneDeep } from 'lodash';
import { Checkbox, Card, Row, Col, Tag } from 'antd';

import styles from './index.less';

export default class Zym extends React.Component {
  state = {
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
    selected: new Set(),
  };

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
   * 点击交易代码时的回调
   * @param e         事件
   * @param tradeCode 交易代码
   */
  onClickTradeCode(e: MouseEvent, tradeCode: string) {
    const currentTradeCode = tradeCode;
    // 改变样式
    document.getElementsByClassName(styles.tradeCodeItem).forEach((item) => {
      item.classList.remove(styles.tradeCodeSelected);
    });
    e.target.classList.add(styles.tradeCodeSelected);
    // 请求交易要素
    fetch('/getTradeElement?tradeCode=' + currentTradeCode)
      .then((resJson) => resJson.json())
      .then((res: Array<object>) => {
        const cloneTradeCode: Array<object> = cloneDeep(this.state.tradeCode);
        const tradeCodeItem = cloneTradeCode.find((item) => {
          return item.code === currentTradeCode;
        });
        // 二次修改
        if (this.state.selected.size) {
          res.forEach((item) => {
            const str = `${currentTradeCode}/${item.element}`;
            if (this.state.selected.has(str)) {
              item.checked = true;
            }
          });
        }
        tradeCodeItem.children = res;
        this.setState({
          tradeCode: cloneTradeCode,
          currentTradeCode,
        });
      });
  }

  /**
   * 交易要素发生变化时的回调
   * @param e             事件
   * @param tradeElement  交易要素
   */
  onChangeTradeElement(e, tradeElement) {
    const checked = e.target.checked;
    // 更改所选交易要素的状态
    const cloneTradeCode = cloneDeep(this.state.tradeCode);
    const tradeCodeIndex = cloneTradeCode.findIndex(
      (item) => item.code === this.state.currentTradeCode,
    );
    const tradeElementIndex = cloneTradeCode[tradeCodeIndex].children.findIndex(
      (item) => item.element == tradeElement,
    );
    cloneTradeCode[tradeCodeIndex].children[
      tradeElementIndex
    ].checked = checked;
    // 更改所选交易要素所对应的交易代码的勾选状态
    const selectedTradeElement = cloneTradeCode[tradeCodeIndex].children.filter(
      (item) => {
        return item.checked === true;
      },
    );
    selectedTradeElement.length
      ? (cloneTradeCode[tradeCodeIndex].checked = true)
      : (cloneTradeCode[tradeCodeIndex].checked = false);
    // 计算已选
    let selected = new Set();
    cloneTradeCode.forEach((tradeCodeItem) => {
      if (tradeCodeItem.children) {
        tradeCodeItem.children.forEach((tradeElementItem) => {
          if (tradeElementItem.checked) {
            selected.add(`${tradeCodeItem.code}/${tradeElementItem.element}`);
          }
        });
      }
    });
    this.setState({
      tradeCode: cloneTradeCode,
      selected,
    });
  }

  /**
   * 移除已选时的回调
   * @param item
   */
  onRemoveSelected(item: string) {
    // 从已选中删除所移除项
    const cloneSelected = cloneDeep(this.state.selected);
    cloneSelected.delete(item);
    // 更新交易要素状态
    const [tradeCode, tradeElement] = item.split('/');
    const cloneTradeCode = cloneDeep(this.state.tradeCode);
    const tradeCodeIndex = cloneTradeCode.findIndex(
      (item) => item.code === tradeCode,
    );
    const tradeElementIndex = cloneTradeCode[tradeCodeIndex].children.findIndex(
      (item) => item.element == tradeElement,
    );
    cloneTradeCode[tradeCodeIndex].children[tradeElementIndex].checked = false;
    // 更新交易代码状态
    const checkResult = [...cloneSelected].filter((item) => {
      return item.includes(tradeCode);
    });
    if (!checkResult.length) {
      console.log('Miele');
      cloneTradeCode[tradeCodeIndex].checked = false;
    }
    this.setState({
      tradeCode: cloneTradeCode,
      selected: cloneSelected,
    });
  }

  render() {
    const { currentTradeCode, tradeCode, selected } = this.state;
    return (
      <Row gutter={16}>
        <Col span={4} offset={6}>
          <Card size="small" title="交易代码" style={{ height: 250 }}>
            {this.state.tradeCode.map((item) => {
              return (
                <section key={item.code}>
                  <Checkbox checked={item.checked} disabled />
                  <span
                    className={styles.tradeCodeItem}
                    onClick={(e) => this.onClickTradeCode(e, item.code)}
                  >
                    {item.code}
                  </span>
                </section>
              );
            })}
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" title="交易要素" style={{ height: 250 }}>
            {tradeCode
              .find((item) => item.code === currentTradeCode)
              ?.children.map((item) => {
                return (
                  <section key={item.element}>
                    <Checkbox
                      checked={item.checked}
                      onChange={(e) =>
                        this.onChangeTradeElement(e, item.element)
                      }
                    >
                      {item.element}
                    </Checkbox>
                    <br />
                  </section>
                );
              })}
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small" title="已选" style={{ height: 250 }}>
            {selected.map((item, index) => {
              return (
                <Tag
                  key={index}
                  className={styles.selectedTag}
                  onClose={() => {
                    this.onRemoveSelected(item);
                  }}
                  closable
                >
                  {item}
                </Tag>
              );
            })}
          </Card>
        </Col>
      </Row>
    );
  }
}
