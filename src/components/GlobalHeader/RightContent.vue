<template>
  <div style="margin-right: 12px">
    <a-dropdown>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="showPassowrd">
            <template #icon>
              <SettingOutlined />
            </template>
            <span>修改密码</span>
          </a-menu-item>
          <a-menu-item @click="handleLogout">
            <template #icon>
              <LogoutOutlined />
            </template>
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </template>
      <div>
        <a-avatar shape="square" size="small">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        {{ currentUser.name }}
      </div>
    </a-dropdown>
    <ChangePassword ref="changePassword" />
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ChangePassword from './ChangePassword.vue';

const { dispatch, getters } = useStore();
const currentUser = { name: getters.userInfo.nickName || getters.userInfo.userName || 'admin' };
const router = useRouter();
const { proxy } = getCurrentInstance();

const handleLogout = () => {
  proxy.$confirm({
    title: '提示',
    content: '确定退出？',
    onOk: () => {
      dispatch('Logout').then(() => {
        router.push({ name: 'login' });
      });
    },
  });
};
const showPassowrd = () => {
  proxy.$refs.changePassword.show();
};
</script>
