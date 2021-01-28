<template>
    <div>
        <el-row>
            <el-col>
                <el-card>
                    <template #header>
                        <div class="clearfix">
                            <span>打印</span>
                        </div>
                    </template>
                    <el-button type="primary" @click="batchPrint"
                        >批量打印</el-button
                    >
                </el-card>
            </el-col>
        </el-row>
        <el-row class="row">
            <el-col>
                <el-card>
                    <template #header>
                        <div class="clearfix">
                            <span>设备接口</span>
                        </div>
                    </template>
                    <el-switch
                        v-model="autoReadCard"
                        active-text="自动读取身份证"
                        inactive-text="点击开启读取身份证"
                    >
                    </el-switch>
                    <div>身份证信息：{{ cardReadInfo.cardInfo }}</div>
                    <div>
                        读取错误：<el-tag type="danger">{{
                            cardReadInfo.error
                        }}</el-tag>
                    </div>
                    <el-divider />
                    <el-button type="primary" @click="getPrinter"
                        >获取打印机</el-button
                    >
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-card>
                    <template #header>
                        <div class="clearfix">
                            <span>基础Api</span>
                        </div>
                    </template>
                    <el-button type="primary" @click="uriSchemeStart"
                        >自定义协议启动</el-button
                    >
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import {
    defineComponent,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    watch,
} from 'vue';
import { BaseApi, DeviceApi, PrintApi } from '../../src';

export default defineComponent({
    name: 'App',
    components: {},
    setup() {
        const cardReadInfo = reactive({
            cardInfo: {},
            error: {},
        });
        const autoReadCard = ref(false);

        const apiOptions = { httpHost: '172.16.12.22' };

        const deviceApi = new DeviceApi(apiOptions);
        const printApi = new PrintApi(apiOptions);
        const baseApi = new BaseApi(apiOptions);
        let intervalHandleRef: any = ref(0);

        onMounted(() => {});

        onBeforeUnmount(() => {
            clearInterval(intervalHandleRef.value);
        });

        watch(autoReadCard, (autoReadCard) => {
            clearInterval(intervalHandleRef.value);
            if (autoReadCard) {
                intervalHandleRef.value = setInterval(readIdCard, 1000);
            }
        });

        // 身份证读卡
        function readIdCard() {
            deviceApi.readIdCard({
                onSuccess(res: any) {
                    cardReadInfo.cardInfo = res.Data;
                },
                onError(res) {
                    cardReadInfo.error = res;
                },
            });
        }

        // 批量打印
        function batchPrint() {
            printApi.print({
                param: [
                    {
                        Url: '',
                        Fs: 2,
                    },
                ],
                onSuccess() {},
            });
        }

        function getPrinter() {
            deviceApi.getPrinters({
                onSuccess(res: any) {
                    ElMessage.success({
                        message: res.Data,
                        type: 'success',
                    });
                },
            });
        }

        function uriSchemeStart() {
            baseApi.uriSchemeStart({
                param: {
                    Uri: 'notary-remote-accept://enterRoom?c21hbGxJZD0yMjI=',
                },
                onSuccess() {},
                onError() {},
            });
        }

        return {
            cardReadInfo,
            readIdCard,
            autoReadCard,
            batchPrint,
            getPrinter,
            uriSchemeStart,
        };
    },
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
.row {
    margin-top: 20px;
}
</style>
