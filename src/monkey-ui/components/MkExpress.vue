<template>
  <div class='mk-express'>
    <div class="time-line-loop">
      <div class="date" />
      <div class="icon-list border">
        <div>
          [收货地址] {{ expressData.name }}
          <span>{{ expressData.mobile }}</span>
        </div>
        <div>{{ expressData.address }}</div>
        <i class="normal recived" />
      </div>
    </div>
    <div
      v-for="(item,index) in expressData.express.trace"
      :key="index"
      class="time-line-loop"
      :class="{discolor:index > 0}"
    >
      <div class="date">
        <p>{{ item.AcceptTime | formatDate }}</p>
        <p>{{ item.AcceptTime | relativeDate }}</p>
      </div>

      <div
        v-if="index === expressData.express.trace.length-1"
        class="icon-list"
      >
        {{ item.AcceptStation }}
        <i class="normal last-point" />
      </div>

      <div
        v-else-if="index === 0"
        class="icon-list border"
      >
        {{ item.AcceptStation }}
        <i class="checked" />
      </div>

      <div
        v-else
        class="icon-list border"
      >
        {{ item.AcceptStation }}
        <i class="normal" />
      </div>
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

export default {
  name: 'MkExpress',
  filters: {
    formatDate(value) {
      // eslint-disable-next-line no-useless-escape
      return value ? format(new Date(value.replace(/\-/g, '/')), 'HH:mm') : '';
    },
    relativeDate(value) {
      let leftDays = '';
      const days = differenceInCalendarDays(
        new Date().getTime(),
        // eslint-disable-next-line no-useless-escape
        new Date(value.replace(/\-/g, '/')).getTime(),
      );

      switch (days) {
        case 0:
          leftDays = '今天';
          break;
        case 1:
          leftDays = '昨天';
          break;
        case 2:
          leftDays = '前天';
          break;
        default:
          leftDays = `${days}天前`;
          break;
      }

      return leftDays;
    },
  },
  props: {
    expressData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {

    };
  },
};
</script>

<style lang='less' scoped>
  .mk-express{
    margin-top: 20px;
  }
  .time-line-loop {
    position: relative;
    display: flex;
    div.date {
      padding-top: 10px;
      width: 138px;
      display: flex;
      flex-direction: column;
      // justify-content: center;
      // align-items: center;
      padding-left: 60px;
      p:first-child {
        height: 29px;
        font-size: 29px;
        font-family: QanelasSoftMedium;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 35px;
      }

      p:last-child {
        height: 30px;
        font-size: 22px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
      }
    }

    .border {
      border-left: 1px dotted #cccccc;
    }
    div.icon-list {
      margin-left: 20px;
      position: relative;
      padding-left: 50px;
      width: 533px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      color: rgba(34, 34, 34, 1);
      line-height: 48px;
      padding-bottom: 50px;
      text-align: left;

      i.checked {
        position: absolute;
        top: 4px;
        left: -20px;
        width: 40px;
        height: 40px;
        background: url("../assets/express/checked.png");
        background-size: 100%;
        display: block;
      }

      i.normal {
        position: absolute;
        left: -8px;
        top: 13px;
        width: 16px;
        height: 16px;
        background: url("../assets/express/pie.png");
        background-size: 100%;
        display: block;
      }
      i.recived {
        position: absolute;
        left: -20px;
        top: 0;
        width: 38px;
        height: 47px;
        background: url("../assets/express/recived.png");
        background-size: 100%;
        display: block;
      }
      i.last-point {
        &::before {
          position: absolute;
          // top: 4px;
          content: "";
          width: 1px;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          height: 10px;
          display: block;
          border-right: 1px dotted #ccc;
        }
      }
    }
  }

  .discolor div.icon-list {
    color: #999999;
  }

  .time-line-loop div.date p:first-child {
    color: #999999;
  }

  .time-line-loop div.date p:last-child {
    color: #999999;
  }
</style>
