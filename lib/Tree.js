'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contextTypes = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

var contextTypes = exports.contextTypes = {
  rcTree: _propTypes2['default'].shape({
    selectable: _propTypes2['default'].bool
  })
};

var Tree = function (_React$Component) {
  (0, _inherits3['default'])(Tree, _React$Component);

  function Tree(props) {
    (0, _classCallCheck3['default'])(this, Tree);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Tree.__proto__ || Object.getPrototypeOf(Tree)).call(this, props));

    _this.onCheck = function (treeNode) {
      var checked = !treeNode.props.checked;
      if (treeNode.props.halfChecked) {
        checked = true;
      }
      var key = treeNode.props.eventKey;
      var checkedKeys = [].concat((0, _toConsumableArray3['default'])(_this.state.checkedKeys));
      var index = checkedKeys.indexOf(key);

      var newSt = {
        event: 'check',
        node: treeNode,
        checked: checked
      };

      if (_this.props.checkStrictly) {
        if (checked && index === -1) {
          checkedKeys.push(key);
        }
        if (!checked && index > -1) {
          checkedKeys.splice(index, 1);
        }
        newSt.checkedNodes = [];
        (0, _util.traverseTreeNodes)(_this.props.children, function (item, idx, pos, k) {
          if (checkedKeys.indexOf(k) !== -1) {
            newSt.checkedNodes.push(item);
          }
        });
        if (!('checkedKeys' in _this.props)) {
          _this.setState({
            checkedKeys: checkedKeys
          });
        }
        var halfChecked = _this.props.checkedKeys ? _this.props.checkedKeys.halfChecked : [];
        _this.props.onCheck((0, _util.getStrictlyValue)(checkedKeys, halfChecked), newSt);
      } else {
        if (checked && index === -1) {
          _this.treeNodesStates[treeNode.props.pos].checked = true;
          (0, _util.updateCheckState)(_this.treeNodesStates, treeNode.props.pos, true);
        }
        if (!checked) {
          _this.treeNodesStates[treeNode.props.pos].checked = false;
          _this.treeNodesStates[treeNode.props.pos].halfChecked = false;
          (0, _util.updateCheckState)(_this.treeNodesStates, treeNode.props.pos, false);
        }
        var checkKeys = (0, _util.getCheck)(_this.treeNodesStates);
        newSt.checkedNodes = checkKeys.checkedNodes;
        newSt.checkedNodesPositions = checkKeys.checkedNodesPositions;
        newSt.halfCheckedKeys = checkKeys.halfCheckedKeys;
        _this.checkKeys = checkKeys;

        _this._checkedKeys = checkedKeys = checkKeys.checkedKeys;
        if (!('checkedKeys' in _this.props)) {
          _this.setState({
            checkedKeys: checkedKeys
          });
        }
        _this.props.onCheck(checkedKeys, newSt);
      }
    };

    _this.onKeyDown = function (e) {
      e.preventDefault();
    };

    _this.checkedKeysChange = true;
    _this.state = {
      expandedKeys: _this.getDefaultExpandedKeys(props),
      checkedKeys: _this.getDefaultCheckedKeys(props),
      selectedKeys: _this.getDefaultSelectedKeys(props),
      dragNodesKeys: '',
      dragOverNodeKey: '',
      dropNodeKey: ''
    };
    return _this;
  }

  (0, _createClass3['default'])(Tree, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var selectable = this.props.selectable;

      return {
        rcTree: {
          selectable: selectable
        }
      };
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var expandedKeys = this.getDefaultExpandedKeys(nextProps, true);
      var checkedKeys = this.getDefaultCheckedKeys(nextProps, true);
      var selectedKeys = this.getDefaultSelectedKeys(nextProps, true);
      var st = {};
      if (expandedKeys) {
        st.expandedKeys = expandedKeys;
      }
      if (checkedKeys) {
        if (nextProps.checkedKeys === this.props.checkedKeys) {
          this.checkedKeysChange = false;
        } else {
          this.checkedKeysChange = true;
        }
        st.checkedKeys = checkedKeys;
      }
      if (selectedKeys) {
        st.selectedKeys = selectedKeys;
      }
      this.setState(st);
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(e, treeNode) {
      this.dragNode = treeNode;
      this.dragNodesKeys = this.getDragNodes(treeNode);
      var st = {
        dragNodesKeys: this.dragNodesKeys
      };
      var expandedKeys = this.getExpandedKeys(treeNode, false);
      if (expandedKeys) {
        // Controlled expand, save and then reset
        this.getRawExpandedKeys();
        st.expandedKeys = expandedKeys;
      }
      this.setState(st);
      this.props.onDragStart({
        event: e,
        node: treeNode
      });
      this._dropTrigger = false;
    }
  }, {
    key: 'onDragEnterGap',
    value: function onDragEnterGap(e, treeNode) {
      var offsetTop = (0, _util.getOffset)(treeNode.refs.selectHandle).top;
      var offsetHeight = treeNode.refs.selectHandle.offsetHeight;
      var pageY = e.pageY;
      var gapHeight = 2; // TODO: remove hard code
      if (pageY > offsetTop + offsetHeight - gapHeight) {
        this.dropPosition = 1;
        return 1;
      }
      if (pageY < offsetTop + gapHeight) {
        this.dropPosition = -1;
        return -1;
      }
      this.dropPosition = 0;
      return 0;
    }
  }, {
    key: 'onDragEnter',
    value: function onDragEnter(e, treeNode) {
      var _this2 = this;

      var enterGap = this.onDragEnterGap(e, treeNode);
      if (this.dragNode.props.eventKey === treeNode.props.eventKey && enterGap === 0) {
        this.setState({
          dragOverNodeKey: ''
        });
        return;
      }
      this.setState({
        dragOverNodeKey: treeNode.props.eventKey
      });

      if (!this.delayedDragEnterLogic) {
        this.delayedDragEnterLogic = {};
      }
      Object.keys(this.delayedDragEnterLogic).forEach(function (key) {
        clearTimeout(_this2.delayedDragEnterLogic[key]);
      });
      this.delayedDragEnterLogic[treeNode.props.pos] = setTimeout(function () {
        var expandedKeys = _this2.getExpandedKeys(treeNode, true);
        if (expandedKeys) {
          _this2.getRawExpandedKeys();
          _this2.setState({ expandedKeys: expandedKeys });
        }
        _this2.props.onDragEnter({
          event: e,
          node: treeNode,
          expandedKeys: expandedKeys && [].concat((0, _toConsumableArray3['default'])(expandedKeys)) || [].concat((0, _toConsumableArray3['default'])(_this2.state.expandedKeys))
        });
      }, 400);
    }
  }, {
    key: 'onDragOver',
    value: function onDragOver(e, treeNode) {
      this.props.onDragOver({ event: e, node: treeNode });
    }
  }, {
    key: 'onDragLeave',
    value: function onDragLeave(e, treeNode) {
      this.props.onDragLeave({ event: e, node: treeNode });
    }
  }, {
    key: 'onDrop',
    value: function onDrop(e, treeNode) {
      var key = treeNode.props.eventKey;
      this.setState({
        dragOverNodeKey: '',
        dropNodeKey: key
      });
      if (this.dragNodesKeys.indexOf(key) > -1) {
        (0, _warning2['default'])(false, 'can not drop to dragNode(include it\'s children node)');
        return false;
      }

      var posArr = treeNode.props.pos.split('-');
      var res = {
        event: e,
        node: treeNode,
        dragNode: this.dragNode,
        dragNodesKeys: [].concat((0, _toConsumableArray3['default'])(this.dragNodesKeys)),
        dropPosition: this.dropPosition + Number(posArr[posArr.length - 1])
      };
      if (this.dropPosition !== 0) {
        res.dropToGap = true;
      }
      if ('expandedKeys' in this.props) {
        res.rawExpandedKeys = [].concat((0, _toConsumableArray3['default'])(this._rawExpandedKeys)) || [].concat((0, _toConsumableArray3['default'])(this.state.expandedKeys));
      }
      this.props.onDrop(res);
      this._dropTrigger = true;
    }
  }, {
    key: 'onDragEnd',
    value: function onDragEnd(e, treeNode) {
      this.setState({
        dragOverNodeKey: ''
      });
      this.props.onDragEnd({ event: e, node: treeNode });
    }
  }, {
    key: 'onExpand',
    value: function onExpand(treeNode) {
      var _this3 = this;

      var expanded = !treeNode.props.expanded;
      var controlled = 'expandedKeys' in this.props;
      var expandedKeys = [].concat((0, _toConsumableArray3['default'])(this.state.expandedKeys));
      var index = expandedKeys.indexOf(treeNode.props.eventKey);
      if (expanded && index === -1) {
        expandedKeys.push(treeNode.props.eventKey);
      } else if (!expanded && index > -1) {
        expandedKeys.splice(index, 1);
      }
      if (!controlled) {
        this.setState({ expandedKeys: expandedKeys });
      }
      this.props.onExpand(expandedKeys, { node: treeNode, expanded: expanded });

      // after data loaded, need set new expandedKeys
      if (expanded && this.props.loadData) {
        return this.props.loadData(treeNode).then(function () {
          if (!controlled) {
            _this3.setState({ expandedKeys: expandedKeys });
          }
        });
      }
    }
  }, {
    key: 'onSelect',
    value: function onSelect(treeNode) {
      var props = this.props;
      var selectedKeys = [].concat((0, _toConsumableArray3['default'])(this.state.selectedKeys));
      var eventKey = treeNode.props.eventKey;
      var index = selectedKeys.indexOf(eventKey);
      var selected = void 0;
      if (index !== -1) {
        selected = false;
        selectedKeys.splice(index, 1);
      } else {
        selected = true;
        if (!props.multiple) {
          selectedKeys.length = 0;
        }
        selectedKeys.push(eventKey);
      }
      var selectedNodes = [];
      if (selectedKeys.length) {
        (0, _util.traverseTreeNodes)(this.props.children, function (item) {
          if (selectedKeys.indexOf(item.key) !== -1) {
            selectedNodes.push(item);
          }
        });
      }
      var newSt = {
        event: 'select',
        node: treeNode,
        selected: selected,
        selectedNodes: selectedNodes
      };
      if (!('selectedKeys' in this.props)) {
        this.setState({
          selectedKeys: selectedKeys
        });
      }
      props.onSelect(selectedKeys, newSt);
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter(e, treeNode) {
      this.props.onMouseEnter({ event: e, node: treeNode });
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(e, treeNode) {
      this.props.onMouseLeave({ event: e, node: treeNode });
    }
  }, {
    key: 'onContextMenu',
    value: function onContextMenu(e, treeNode) {
      var eventKey = treeNode.props.eventKey;
      this.setState({ selectedKeys: [eventKey] });
      this.props.onRightClick({ event: e, node: treeNode });
    }

    // all keyboard events callbacks run from here at first

  }, {
    key: 'getFilterExpandedKeys',
    value: function getFilterExpandedKeys(props, expandKeyProp, expandAll) {
      var keys = props[expandKeyProp];
      if (!expandAll && !props.autoExpandParent) {
        return keys || [];
      }
      var expandedPositionArr = [];
      if (props.autoExpandParent) {
        (0, _util.traverseTreeNodes)(props.children, function (item, index, pos, key) {
          if (keys.indexOf(key) > -1) {
            expandedPositionArr.push(pos);
          }
        });
      }
      var filterExpandedKeysSet = {};
      (0, _util.traverseTreeNodes)(props.children, function (item, index, pos, key) {
        if (expandAll) {
          filterExpandedKeysSet[key] = true;
        } else if (props.autoExpandParent) {
          var isCurrentParentOfExpanded = expandedPositionArr.some(function (p) {
            return (0, _util.isInclude)(pos.split('-'), p.split('-'));
          });
          if (isCurrentParentOfExpanded) {
            filterExpandedKeysSet[key] = true;
          }
        }
      });
      var filterExpandedKeys = Object.keys(filterExpandedKeysSet);
      return filterExpandedKeys.length ? filterExpandedKeys : keys;
    }
  }, {
    key: 'getDefaultExpandedKeys',
    value: function getDefaultExpandedKeys(props, willReceiveProps) {
      var expandedKeys = willReceiveProps ? undefined : this.getFilterExpandedKeys(props, 'defaultExpandedKeys', props.defaultExpandedKeys.length ? false : props.defaultExpandAll);
      if ('expandedKeys' in props) {
        expandedKeys = (props.autoExpandParent ? this.getFilterExpandedKeys(props, 'expandedKeys', false) : props.expandedKeys) || [];
      }
      return expandedKeys;
    }
  }, {
    key: 'getDefaultCheckedKeys',
    value: function getDefaultCheckedKeys(props, willReceiveProps) {
      var checkedKeys = willReceiveProps ? undefined : props.defaultCheckedKeys;
      if ('checkedKeys' in props) {
        checkedKeys = props.checkedKeys || [];
        if (props.checkStrictly) {
          if (props.checkedKeys.checked) {
            checkedKeys = props.checkedKeys.checked;
          } else if (!Array.isArray(props.checkedKeys)) {
            checkedKeys = [];
          }
        }
      }
      return checkedKeys;
    }
  }, {
    key: 'getDefaultSelectedKeys',
    value: function getDefaultSelectedKeys(props, willReceiveProps) {
      var getKeys = function getKeys(keys) {
        if (props.multiple) {
          return [].concat((0, _toConsumableArray3['default'])(keys));
        }
        if (keys.length) {
          return [keys[0]];
        }
        return keys;
      };
      var selectedKeys = willReceiveProps ? undefined : getKeys(props.defaultSelectedKeys);
      if ('selectedKeys' in props) {
        selectedKeys = getKeys(props.selectedKeys);
      }
      return selectedKeys;
    }
  }, {
    key: 'getRawExpandedKeys',
    value: function getRawExpandedKeys() {
      if (!this._rawExpandedKeys && 'expandedKeys' in this.props) {
        this._rawExpandedKeys = [].concat((0, _toConsumableArray3['default'])(this.state.expandedKeys));
      }
    }
  }, {
    key: 'getOpenTransitionName',
    value: function getOpenTransitionName() {
      var props = this.props;
      var transitionName = props.openTransitionName;
      var animationName = props.openAnimation;
      if (!transitionName && typeof animationName === 'string') {
        transitionName = props.prefixCls + '-open-' + animationName;
      }
      return transitionName;
    }
  }, {
    key: 'getDragNodes',
    value: function getDragNodes(treeNode) {
      var dragNodesKeys = [];
      var tPArr = treeNode.props.pos.split('-');
      (0, _util.traverseTreeNodes)(treeNode.props.children, function (item, index, pos, key) {
        var pArr = pos.split('-');
        if (treeNode.props.pos === pos || tPArr.length < pArr.length && (0, _util.isInclude)(tPArr, pArr)) {
          dragNodesKeys.push(key);
        }
      });
      return dragNodesKeys;
    }
  }, {
    key: 'getExpandedKeys',
    value: function getExpandedKeys(treeNode, expand) {
      var key = treeNode.props.eventKey;
      var expandedKeys = this.state.expandedKeys;
      var expandedIndex = expandedKeys.indexOf(key);
      var exKeys = void 0;
      if (expandedIndex > -1 && !expand) {
        exKeys = [].concat((0, _toConsumableArray3['default'])(expandedKeys));
        exKeys.splice(expandedIndex, 1);
        return exKeys;
      }
      if (expand && expandedKeys.indexOf(key) === -1) {
        return expandedKeys.concat([key]);
      }
    }
  }, {
    key: 'filterTreeNode',
    value: function filterTreeNode(treeNode) {
      var filterTreeNode = this.props.filterTreeNode;
      if (typeof filterTreeNode !== 'function' || treeNode.props.disabled) {
        return false;
      }
      return filterTreeNode.call(this, treeNode);
    }
  }, {
    key: 'renderTreeNode',
    value: function renderTreeNode(child, index) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var state = this.state,
          props = this.props;

      var pos = level + '-' + index;
      var key = child.key || pos;

      var cloneProps = {
        root: this,
        eventKey: key,
        pos: pos,
        loadData: props.loadData,
        prefixCls: props.prefixCls,
        showIcon: props.showIcon,
        draggable: props.draggable,
        dragOver: state.dragOverNodeKey === key && this.dropPosition === 0,
        dragOverGapTop: state.dragOverNodeKey === key && this.dropPosition === -1,
        dragOverGapBottom: state.dragOverNodeKey === key && this.dropPosition === 1,
        _dropTrigger: this._dropTrigger,
        expanded: state.expandedKeys.indexOf(key) !== -1,
        selected: state.selectedKeys.indexOf(key) !== -1,
        openTransitionName: this.getOpenTransitionName(),
        openAnimation: props.openAnimation,
        filterTreeNode: this.filterTreeNode.bind(this)
      };
      if (props.checkable) {
        cloneProps.checkable = props.checkable;
        if (props.checkStrictly) {
          if (state.checkedKeys) {
            cloneProps.checked = state.checkedKeys.indexOf(key) !== -1;
          }
          if (props.checkedKeys && props.checkedKeys.halfChecked) {
            cloneProps.halfChecked = props.checkedKeys.halfChecked.indexOf(key) !== -1;
          } else {
            cloneProps.halfChecked = false;
          }
        } else {
          if (this.checkedKeys) {
            cloneProps.checked = this.checkedKeys.indexOf(key) !== -1;
          }
          cloneProps.halfChecked = this.halfCheckedKeys.indexOf(key) !== -1;
        }
      }
      return _react2['default'].cloneElement(child, cloneProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var props = this.props;
      var className = (0, _classnames2['default'])(props.prefixCls, props.className, (0, _defineProperty3['default'])({}, props.prefixCls + '-show-line', props.showLine));
      var domProps = {};
      if (props.focusable) {
        domProps.tabIndex = '0';
        domProps.onKeyDown = this.onKeyDown;
      }
      if (props.checkable && (this.checkedKeysChange || props.loadData)) {
        var checkedKeys = this.state.checkedKeys;
        var checkKeys = void 0;
        if (!props.loadData && this.checkKeys && this._checkedKeys && (0, _util.arraysEqual)(this._checkedKeys, checkedKeys)) {
          // if checkedKeys the same as _checkedKeys from onCheck, use _checkedKeys.
          checkKeys = this.checkKeys;
        } else {
          var checkedPositions = [];
          this.treeNodesStates = {};
          (0, _util.traverseTreeNodes)(props.children, function (item, index, pos, key, childrenPos, parentPos) {
            _this4.treeNodesStates[pos] = {
              node: item,
              key: key,
              checked: false,
              halfChecked: false,
              disabled: item.props.disabled,
              disableCheckbox: item.props.disableCheckbox,
              childrenPos: childrenPos,
              parentPos: parentPos
            };
            if (checkedKeys.indexOf(key) !== -1) {
              _this4.treeNodesStates[pos].checked = true;
              checkedPositions.push(pos);
            }
          });
          // if the parent node's key exists, it all children node will be checked
          checkedPositions.forEach(function (checkedPosition) {
            (0, _util.updateCheckState)(_this4.treeNodesStates, checkedPosition, true);
          });
          checkKeys = (0, _util.getCheck)(this.treeNodesStates);
        }
        this.halfCheckedKeys = checkKeys.halfCheckedKeys;
        this.checkedKeys = checkKeys.checkedKeys;
      }

      return _react2['default'].createElement(
        'ul',
        (0, _extends3['default'])({}, domProps, {
          className: className,
          role: 'tree-node',
          unselectable: true
        }),
        _react2['default'].Children.map(props.children, this.renderTreeNode, this)
      );
    }
  }]);
  return Tree;
}(_react2['default'].Component);

Tree.propTypes = {
  prefixCls: _propTypes2['default'].string,
  children: _propTypes2['default'].any,
  showLine: _propTypes2['default'].bool,
  showIcon: _propTypes2['default'].bool,
  selectable: _propTypes2['default'].bool,
  multiple: _propTypes2['default'].bool,
  checkable: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].node]),
  checkStrictly: _propTypes2['default'].bool,
  draggable: _propTypes2['default'].bool,
  autoExpandParent: _propTypes2['default'].bool,
  defaultExpandAll: _propTypes2['default'].bool,
  defaultExpandedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  expandedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  defaultCheckedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  checkedKeys: _propTypes2['default'].oneOfType([_propTypes2['default'].arrayOf(_propTypes2['default'].string), _propTypes2['default'].object]),
  defaultSelectedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  selectedKeys: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  onExpand: _propTypes2['default'].func,
  onCheck: _propTypes2['default'].func,
  onSelect: _propTypes2['default'].func,
  loadData: _propTypes2['default'].func,
  onMouseEnter: _propTypes2['default'].func,
  onMouseLeave: _propTypes2['default'].func,
  onRightClick: _propTypes2['default'].func,
  onDragStart: _propTypes2['default'].func,
  onDragEnter: _propTypes2['default'].func,
  onDragOver: _propTypes2['default'].func,
  onDragLeave: _propTypes2['default'].func,
  onDrop: _propTypes2['default'].func,
  onDragEnd: _propTypes2['default'].func,
  filterTreeNode: _propTypes2['default'].func,
  openTransitionName: _propTypes2['default'].string,
  openAnimation: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].object])
};
Tree.childContextTypes = contextTypes;
Tree.defaultProps = {
  prefixCls: 'rc-tree',
  showLine: false,
  showIcon: true,
  selectable: true,
  multiple: false,
  checkable: false,
  checkStrictly: false,
  draggable: false,
  autoExpandParent: true,
  defaultExpandAll: false,
  defaultExpandedKeys: [],
  defaultCheckedKeys: [],
  defaultSelectedKeys: [],
  onExpand: noop,
  onCheck: noop,
  onSelect: noop,
  onDragStart: noop,
  onDragEnter: noop,
  onDragOver: noop,
  onDragLeave: noop,
  onDrop: noop,
  onDragEnd: noop,
  onMouseEnter: noop,
  onMouseLeave: noop,
  onRightClick: noop
};
exports['default'] = Tree;