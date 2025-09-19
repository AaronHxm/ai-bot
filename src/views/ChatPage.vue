<template>
  <div class="chat-container">
    <!-- 使用SDK的View组件，并通过插槽自定义各个部分 -->
    <View
        ref="chatView"
        :showSider="false"
        :contentProps="{
        hideMessageAction: false,
        hideEditSource: false,
        showDebug: false,
        showReferenceImgs: true,
        showTip: true,
      }"
        :style="viewBackgroundStyle"
    >
      <!-- 自定义会话列表头部 -->
      <!-- 自定义会话列表头部 -->
      <template #SessionList_header="{ toggleOpen, open }">
        <div class="custom-session-header">
          <h2 class="session-title">消息列表</h2>
          <CircleClose
              style="
              width: 24px;
              height: 24px;
              color: rgba(200, 200, 200, 1);
              position: absolute;
              right: 5px;
            "
              @click="handleSiderToggle"
          />
        </div>
      </template>

      <!-- 自定义会话列表内容 -->
      <template
          #SessionList_body="{
          recentData,
          oldData,
          onEditConfirm,
          onDeleteSession,
        }"
      >
        <div class="session-list-body">
          <!-- 今天会话 -->
          <div class="time-section" v-if="recentData && recentData.length > 0">
            <div class="time-label">今天</div>
            <div class="session-items">
              <div
                  v-for="item in recentData"
                  :key="item.id"
                  class="session-item"
              >
                <div class="session-content">
                  {{ item.title || "未命名会话" }}
                </div>
                <div class="session-actions">
                  <el-dropdown
                      trigger="click"

                  >
                    <el-button size="small" text class="action-btn">
                      <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8 5C8.55228 5 9 4.55228 9 4C9 3.44772 8.55228 3 8 3C7.44772 3 7 3.44772 7 4C7 4.55228 7.44772 5 8 5ZM8 9C8.55228 9 9 8.55229 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55229 7.44772 9 8 9ZM9 11.6667C9 12.219 8.55228 12.6667 8 12.6667C7.44772 12.6667 7 12.219 7 11.6667C7 11.1144 7.44772 10.6667 8 10.6667C8.55228 10.6667 9 11.1144 9 11.6667Z"
                            fill="#C8C8C8"
                        />
                      </svg>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item  divided >重命名
                        </el-dropdown-item >
                        <el-dropdown-item @click="onDeleteSession(item.id)" divided
                        >删除
                        </el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>

          <!-- 更早会话 -->
          <div class="time-section" v-if="oldData && oldData.length > 0">
            <div class="time-label">更早</div>
            <div class="session-items">
              <div
                  v-for="item in oldData"
                  :key="item.id"
                  class="session-item"
              >
                <div class="session-content">
                  {{ item.title || "未命名会话" }}
                </div>
                <div class="session-actions">
                  <el-dropdown
                      trigger="click"
                  >
                    <el-button size="small" text class="action-btn">
                      <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8 5C8.55228 5 9 4.55228 9 4C9 3.44772 8.55228 3 8 3C7.44772 3 7 3.44772 7 4C7 4.55228 7.44772 5 8 5ZM8 9C8.55228 9 9 8.55229 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55229 7.44772 9 8 9ZM9 11.6667C9 12.219 8.55228 12.6667 8 12.6667C7.44772 12.6667 7 12.219 7 11.6667C7 11.1144 7.44772 10.6667 8 10.6667C8.55228 10.6667 9 11.1144 9 11.6667Z"
                            fill="#C8C8C8"
                        />
                      </svg>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item    divided
                        >重命名
                        </el-dropdown-item
                        >
                        <el-dropdown-item @click="onDeleteSession(item.id)" divided
                        >删除
                        </el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div
              class="empty-state"
              v-if="!recentData?.length && !oldData?.length"
          >
            <div class="empty-content">
              <div class="empty-icon">💬</div>
              <div class="empty-text">暂无会话记录</div>
            </div>
          </div>
        </div>


        <!-- 重命名弹窗 -->
        <el-dialog
            v-model="renameDialogVisible"
            title="重命名会话"
            width="400px"
        >
          <el-input
              v-model="renameForm.title"
              placeholder="请输入会话名称"
              clearable
          />

          <template #footer>
          <span class="dialog-footer">
            <el-button @click="renameDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="onEditConfirm(currentItem)">
              确认
            </el-button>
          </span>
          </template>
        </el-dialog>
      </template>

      <!-- 自定义聊天开始页面 -->
      <template #ChatBegin_default="{ send, config }">
        <div class="welcome-screen">
          <div class="welcome-header">
            <!-- 侧边栏按钮 -->
            <button class="new-chat-button" @click="handleSiderToggle">
              <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M1 6H14"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M1 18H14"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M1 12H16"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
              </svg>
            </button>

            <div class="coherent-logo">
              <img :src="coherentLogo" alt="coherent-logo"/>
            </div>
            <!-- 新建聊天按钮 -->
            <button class="new-chat-button" @click="handleNewSession">
              <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M12.0131 7.49552C11.8548 7.49542 11.7013 7.54995 11.5785 7.6499C11.4558 7.74986 11.3713 7.88911 11.3393 8.04414L11.3256 8.18164V11.3125H8.17957L8.04207 11.3263C7.88665 11.3578 7.74693 11.4421 7.64656 11.5649C7.5462 11.6877 7.49138 11.8414 7.49138 12C7.49138 12.1586 7.5462 12.3123 7.64656 12.4351C7.74693 12.5579 7.88665 12.6422 8.04207 12.6738L8.17957 12.6875H11.3256V15.8321C11.3256 16.0145 11.398 16.1893 11.5269 16.3183C11.6559 16.4472 11.8307 16.5196 12.0131 16.5196C12.1954 16.5196 12.3703 16.4472 12.4992 16.3183C12.6281 16.1893 12.7006 16.0145 12.7006 15.8321V12.6875H15.8273C16.0097 12.6875 16.1845 12.6151 16.3135 12.4862C16.4424 12.3572 16.5148 12.1824 16.5148 12C16.5148 11.8177 16.4424 11.6428 16.3135 11.5139C16.1845 11.3849 16.0097 11.3125 15.8273 11.3125H12.7006V8.18302L12.6868 8.04414C12.6551 7.88885 12.5707 7.74929 12.448 7.64906C12.3252 7.54884 12.1716 7.49411 12.0131 7.49414V7.49552Z"
                    fill="black"
                />
                <path
                    d="M11.9951 2.14813C10.1063 2.14907 8.25753 2.69296 6.6691 3.71502C5.08067 4.73708 3.81953 6.19423 3.03593 7.91285C2.25232 9.63148 1.97929 11.5391 2.24934 13.4086C2.5194 15.278 3.32117 17.0304 4.55913 18.457C4.03938 18.9809 3.39313 19.6313 2.93251 20.0919C2.29176 20.7326 2.72763 21.8519 3.65851 21.8519H11.9951C14.608 21.8519 17.1139 20.8139 18.9615 18.9663C20.809 17.1187 21.847 14.6129 21.847 12C21.847 9.38713 20.809 6.88126 18.9615 5.03368C17.1139 3.18609 14.608 2.14813 11.9951 2.14813ZM11.9951 3.52313C14.2433 3.52313 16.3995 4.41623 17.9892 6.00595C19.5789 7.59567 20.472 9.7518 20.472 12C20.472 14.2482 19.5789 16.4043 17.9892 17.9941C16.3995 19.5838 14.2433 20.4769 11.9951 20.4769H4.48901C5.01976 19.9461 5.61513 19.3508 6.00151 18.9589C6.12901 18.8295 6.20014 18.655 6.19937 18.4733C6.19859 18.2917 6.12598 18.1178 5.99738 17.9895C4.81321 16.8035 4.00716 15.2932 3.6811 13.6492C3.35503 12.0053 3.52358 10.3016 4.16545 8.75347C4.80731 7.20531 5.89369 5.88215 7.28729 4.95121C8.6809 4.02026 10.3192 3.5233 11.9951 3.52313Z"
                    fill="black"
                />
              </svg>
            </button>
          </div>

          <div class="welcome-box">
            <div class="welcome-message">
              <div class="welcome-text">
                <div class="greeting">{{ config?.bot?.name }}</div>
                <div class="main-message">有什么问题随时问我吧~</div>
              </div>
              <div class="robot-avatar">
                <img :src="robot" alt="robot"/>
              </div>
            </div>

            <div class="services-section">
              <button class="service-btn">我能为您提供多种服务</button>
              <p class="service-desc">
                {{ config?.bot?.description }}
              </p>
            </div>
          </div>

          <div class="example-questions">
            <h3>试一试:</h3>
            <div class="question-list">
              <div
                  v-for="(question, index) in config?.bot?.begin?.questions"
                  :key="index"
                  class="question-item"
                  @click="send(question)"
              >
                <div class="question-icon">
                  <img :src="questionIcon" alt="question-icon"/>
                </div>

                <span class="question-text">{{ question }}</span>
                <span class="arrow-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M4 8H12"
                        stroke="#646464"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M8 4L12 8L8 12"
                        stroke="#646464"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 自定义用户消息内容 -->
      <template #ChatContent_userContent="{ content }">
        <div class="custom-user-message">
          <div class="message-bubble">
            {{ content }}
          </div>
          <div class="message-header-left-avatar">
            <img :src="userAvatar" alt="user-avatar"/>
          </div>
        </div>
      </template>

      <!-- 自定义引用源显示 -->
      <template #ChatContent_sourceItem="{ list }">
        <div v-if="list && list.length > 0" class="link-sources">
          <el-link
              type="primary"
              v-for="(source, index) in list"
              :key="index"
              :href="source.sourceUrl"
              target="_blank"
              :icon="Link"
              class="source-link"
          >
            {{ source.sourceName || "参考链接" }}
          </el-link>
        </div>
      </template>

      <!-- 自定义新建聊天按钮 -->
      <template #ChatInput_newChat="{ onNewSession }">
        <button
            style="display: none"
            class="new-chat-button"
            @click="onNewSession"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
                d="M10 4V16M4 10H16"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
            />
          </svg>
        </button>
      </template>

      <!-- 自定义输入区域 -->
      <template #ChatInput_input="{ send, loading }">
        <div class="custom-input-area">
          <input
              v-model="userInput"
              type="text"
              placeholder="请输入您的问题"
              :disabled="loading"
              @keyup.enter="handleSend(send)"
              class="message-input"
          />
          <button
              @click="handleSend(send)"
              :disabled="loading || !userInput.trim()"
              class="send-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                  d="M2.90909 21L21.5455 12L2.90909 3L3 10.3636L15.5455 12L3 13.6364L2.90909 21Z"
                  fill="white"
              />
            </svg>
          </button>
        </div>
      </template>

      <!-- 自定义消息底部操作 -->
      <template #ChatContent_bottomActions="{ copy, voteType, feedback }">
        <div class="bottom-actions">
          <div class="bottom-actions-tip">
            <Warning style="width: 1em; height: 1em; margin-right: 8px"/>
            内容由AI生成，仅供参考
          </div>
          <!-- 复制按钮 -->
          <el-button type="text" @click="copy" class="action-btn">
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.07941 2.41267C5.13023 2.36187 5.19914 2.33333 5.271 2.33333H13.3957C13.4675 2.33333 13.5365 2.36188 13.5873 2.41271C13.6381 2.46353 13.6667 2.53246 13.6667 2.60433V10.7291C13.6666 10.801 13.6381 10.8699 13.5873 10.9207C13.5364 10.9715 13.4675 11 13.3957 11H12.3333V5.27133C12.3334 5.06068 12.2919 4.85208 12.2114 4.65744C12.1308 4.46273 12.0126 4.2858 11.8636 4.13677C11.7147 3.98773 11.5378 3.8695 11.3431 3.78884C11.1486 3.70828 10.9403 3.66667 10.7293 3.66667H5V2.604C5.00009 2.53223 5.02864 2.46342 5.07941 2.41267ZM3.66667 3.66667V2.604C3.66682 2.1786 3.83591 1.77044 4.13677 1.4697C4.43762 1.16895 4.8456 1 5.271 1H13.3957C13.8212 1 14.2292 1.16903 14.5301 1.4699C14.831 1.77077 15 2.17884 15 2.60433V10.7293C14.9998 11.1547 14.8308 11.5629 14.5299 11.8636C14.229 12.1644 13.8211 12.3333 13.3957 12.3333H12.3333V13.3957C12.3333 13.8211 12.1644 14.229 11.8636 14.5299C11.5629 14.8308 11.155 14.9998 10.7296 15H2.60433C2.17884 15 1.77077 14.831 1.4699 14.5301C1.16903 14.2292 1 13.8212 1 13.3957V5.271C1 4.8457 1.16887 4.43781 1.46949 4.13697C1.77012 3.83613 2.17789 3.66697 2.60319 3.66667H3.66667ZM2.41264 5.07944C2.46338 5.02866 2.5322 5.00009 2.60398 5H10.7293C10.7647 5 10.7996 5.00692 10.8327 5.02064C10.8656 5.03426 10.8955 5.05423 10.9207 5.07941C10.9458 5.10458 10.9658 5.13447 10.9794 5.16736C10.993 5.20025 11 5.23574 11 5.27133V13.3957C11 13.4675 10.9715 13.5364 10.9207 13.5873C10.8699 13.6381 10.801 13.6666 10.7291 13.6667H2.60433C2.53246 13.6667 2.46353 13.6381 2.41271 13.5873C2.36188 13.5365 2.33333 13.4675 2.33333 13.3957V5.271C2.33333 5.19916 2.36186 5.13026 2.41264 5.07944Z"
                  fill="black"
              />
            </svg>
          </el-button>
          <!-- 点赞按钮 -->
          <el-button type="text" @click="feedback(0)" class="action-btn">
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.6275 13.3333C12.9796 13.3395 13.2825 13.0903 13.347 12.7477V8.65141C13.2762 8.26514 12.9389 7.99424 12.6275 7.99975C12.6235 7.99981 12.6196 7.99985 12.6157 7.99985H11.6803V13.3332H12.6157C12.6196 13.3332 12.6235 13.3332 12.6275 13.3333ZM14.6743 12.8892C14.5351 13.9188 13.6486 14.6817 12.6104 14.6665H11.0137C11.012 14.6665 11.0102 14.6665 11.0085 14.6665H4.04498C3.1162 14.675 2.32219 13.9991 2.18257 13.0804L2.18248 13.0798L1.35449 7.67989C1.27231 7.13842 1.43205 6.58817 1.79143 6.17489C2.14986 5.76271 2.67083 5.52821 3.21696 5.53318H6.14696V3.79985C6.14696 2.43753 7.2513 1.33318 8.61362 1.33318C8.87708 1.33318 9.11583 1.48834 9.22283 1.72909L11.4172 6.66652H12.6104C13.6916 6.65094 14.5411 7.52547 14.6743 8.51048C14.6783 8.5401 14.6803 8.56996 14.6803 8.59985V12.7999C14.6803 12.8297 14.6783 12.8596 14.6743 12.8892ZM3.50074 12.8799C3.54062 13.1428 3.76814 13.3362 4.03409 13.3332L4.04162 13.3332H10.347V7.54133L8.21278 2.73944C7.78468 2.90134 7.48029 3.31503 7.48029 3.79985V6.19985C7.48029 6.56804 7.18181 6.86652 6.81362 6.86652H3.21361L3.20604 6.86647C3.0496 6.8647 2.90025 6.93172 2.79756 7.04981C2.69499 7.16776 2.64933 7.32479 2.67267 7.47938L2.67273 7.47981L3.50074 12.8799Z"
                  :fill="voteType === 0 ? '#409eff' : 'black'"
              />
            </svg>
          </el-button>
          <!-- 点踩按钮 -->
          <el-button type="text" @click="feedback(1)" class="action-btn">
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.607 2.66663C12.9591 2.6604 13.262 2.90965 13.3265 3.25222V7.34852C13.2557 7.73478 12.9184 8.00569 12.607 8.00018C12.603 8.00011 12.5991 8.00007 12.5952 8.00007H11.6598V2.66673H12.5952C12.5991 2.66673 12.603 2.6667 12.607 2.66663ZM14.6538 3.1107C14.5146 2.08108 13.6281 1.31825 12.5898 1.3334H10.9932C10.9915 1.3334 10.9897 1.3334 10.988 1.33342H4.02447C3.09569 1.32497 2.30169 2.00086 2.16207 2.91952L2.16197 2.92013L1.33399 8.32003C1.2518 8.8615 1.41154 9.41176 1.77093 9.82504C2.12936 10.2372 2.65032 10.4717 3.19645 10.4667H6.12645V12.2001C6.12645 13.5624 7.23079 14.6667 8.59311 14.6667C8.85657 14.6667 9.09532 14.5116 9.20232 14.2708L11.3967 9.33341H12.5899C13.6711 9.34898 14.5206 8.47446 14.6538 7.48944C14.6578 7.45982 14.6598 7.42996 14.6598 7.40007V3.20006C14.6598 3.17017 14.6578 3.14032 14.6538 3.1107ZM3.48023 3.12004C3.52011 2.8571 3.74763 2.6637 4.01358 2.66671L4.02111 2.66675H10.3264V8.4586L8.19227 13.2605C7.76417 13.0986 7.45978 12.6849 7.45978 12.2001V9.80007C7.45978 9.43188 7.1613 9.13341 6.79311 9.13341H3.1931L3.18553 9.13345C3.0291 9.13523 2.87974 9.0682 2.77705 8.95011C2.67448 8.83217 2.62882 8.67514 2.65216 8.52054L2.65222 8.52011L3.48023 3.12004Z"
                  :fill="voteType === 1 ? '#f56c6c' : 'black'"
              />
            </svg>
          </el-button>
        </div>
      </template>
    </View>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {View} from "@custouch-open/zenative-chat-sdk-web";
import "@custouch-open/zenative-chat-sdk-web/style";
import coherentLogo from "../assets/coherent-logo-blue.png";
import robot from "../assets/robot.png";
import userAvatar from "../assets/Avatar.png";
import {Link, Warning, CircleClose, More} from "@element-plus/icons-vue";
import questionIcon from "../assets/question.svg";

const userInput = ref("");
const open = ref(true);
const chatView = ref(null);



const renameDialogVisible = ref(false)
const renameForm = reactive({
  id: '',
  title: ''
})
let currentItem = null

// 打开重命名弹窗
const openRenameDialog = (item) => {
  currentItem = item
  renameForm.id = item.id
  renameForm.title = item.title || ''
  renameDialogVisible.value = true
}



// 预定义的背景样式选项
const backgroundOptions = {
  // 方法1: 线性渐变 - 蓝紫渐变
  gradient1:
      "linear-gradient(133.21deg, rgba(0, 50, 255, 0.1) 0%, rgba(43, 145, 255, 0.1) 31.95%, rgba(85, 240, 255, 0.1) 63.9%),linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, #F5F5F5 30%)",
  // 截图匹配的渐变背景 - 更淡的蓝紫色调，越往下越接近灰色
  screenshotGradient:
      "linear-gradient(135deg, rgba(0, 50, 255, 0.03) 0%, rgba(43, 145, 255, 0.05) 30%, rgba(85, 240, 255, 0.03) 70%), linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(245, 245, 245, 0.9) 50%, rgba(240, 240, 240, 0.95) 100%)",
};

// View 组件的背景样式
const viewBackgroundStyle = ref({
  background: backgroundOptions.screenshotGradient,
});

const handleSiderToggle = () => {
  const element = document.querySelector(".i-h-full.i-absolute.i-left-0");

  if (element) {
    // 如果元素的display为none，设置为block，反之设置为none
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
      renameDialogVisible.value = false
    }
    renameDialogVisible.value = false

  }

};
// 新建会话的方法
const handleNewSession = () => {
  // 尝试通过发送特殊消息来触发新会话
  // 或者通过其他SDK提供的方法
  console.log("尝试创建新会话");

  // 方法1: 尝试调用SDK的方法
  if (chatView.value && typeof chatView.value.createNewSession === "function") {
    chatView.value.createNewSession();
  } else if (
      chatView.value &&
      typeof chatView.value.newSession === "function"
  ) {
    chatView.value.newSession();
  } else if (chatView.value && typeof chatView.value.reset === "function") {
    chatView.value.reset();
  } else {
    // 方法2: 如果SDK没有提供直接方法，尝试刷新页面
    console.log("SDK未提供新建会话方法，刷新页面");
    window.location.reload();
  }
};

const handleSend = (sendFunction) => {
  if (userInput.value.trim()) {
    sendFunction(userInput.value);
    userInput.value = "";
  }
};



// 复制链接
const handleCopyLink = async (source) => {

  if (source.url) {
    try {
      await navigator.clipboard.writeText(source.url);
      alert("链接已复制到剪贴板");
    } catch (err) {
      console.error("复制失败:", err);
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = source.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("链接已复制");
    }
  }
};

</script>

<style scoped>
/* 自定义底部 复制 点赞 的样式 */

.bottom-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  border-top: 1px solid rgba(230, 231, 232, 1);
}

.bottom-actions-tip {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: rgba(159, 161, 164, 1);
}

.action-btn {
  padding: 4px 8px;
  min-width: 32px;
}

.action-btn:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 引用源的样式 */
.link-sources {
  width: 100%;
  margin: 8px 0;
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(0, 50, 255, 0.05);
}

.text-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  display: block;
  margin-bottom: 6px;
  padding: 2px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.link-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.chat-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: linear-gradient(
      133.21deg,
      rgba(0, 50, 255, 0.1) 0%,
      rgba(43, 145, 255, 0.1) 31.95%,
      rgba(85, 240, 255, 0.1) 63.9%
  ),
  linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, #f5f5f5 30%);
}

/* 自定义会话列表头部 */
.custom-session-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  /* border-bottom: 1px solid #e9ecef; */
  height: 56px;
  box-sizing: border-box;
}

.session-title {
  position: absolute;
  width: 64px;
  height: 24px;
  left: 16px;
  top: 16px;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #0032ff;
  margin: 0;
}

.close-btn {
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 4px;
  width: 24px;
  height: 24px;
  color: #666;
}

.close-btn:hover {
  color: #333;
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 自定义会话列表头部 */
.custom-session-header {
  background-color: rebeccapurple;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  /* border-bottom: 1px solid #e9ecef; */
  height: 56px;
  box-sizing: border-box;
}

.session-title {
  position: absolute;
  width: 64px;
  height: 24px;
  left: 16px;
  top: 16px;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #0032ff;
  margin: 0;
}

.close-btn {
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 4px;
  color: #666;
}

.close-btn:hover {
  color: #333;
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 自定义会话列表 */
.session-list-body {
  width: 100%;
  height: calc(100% - 56px);
  /* background: #f4faff; */
  overflow-y: auto;
  padding: 0;
}

.time-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.time-label {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
  color: rgba(100, 100, 100, 0.8);
  margin-bottom: 12px;
}

.session-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 12px 16px 12px 0;
  background: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  /* border: 1px solid transparent; */
}

.session-item:hover {
  background-color: rgba(0, 50, 255, 0.05);
}

.session-content {
  flex: 1;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  white-space: nowrap;
}

.session-actions {
  flex-shrink: 0;
  margin-left: 8px;
}

.action-btn {
  padding: 4px;
  transition: opacity 0.2s ease;
}

.session-item:hover .action-btn {
  opacity: 1;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 0 16px;
}

.empty-content {
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(100, 100, 100, 0.6);
}

/* 滚动条样式 */
.session-list-body::-webkit-scrollbar {
  width: 4px;
}

.session-list-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.session-list-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.session-list-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 背景装饰元素 */
/* .session-list-body::before {
  content: "";
  position: absolute;
  width: 310px;
  height: 310px;
  left: -71px;
  top: -90px;
  background: #55f0ff;
  opacity: 0.2;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.session-list-body::after {
  content: "";
  position: absolute;
  width: 310px;
  height: 310px;
  left: 136px;
  top: -95px;
  background: #0032ff;
  opacity: 0.1;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
} */

/* 确保内容在背景之上 */
.time-section,
.empty-state {
  position: relative;
  z-index: 1;
}

/* 欢迎界面样式 */
.welcome-screen {
  padding: 0 0 20px 0;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.welcome-header {
  margin-bottom: 10px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.coherent-logo {
  font-size: 24px;
  font-weight: bold;
  color: #0032ff;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: 90px;
    height: 18px;
  }
}

.welcome-box {
  width: 343px;
  height: 207px;
  background: linear-gradient(
      92.9deg,
      rgba(0, 50, 255, 0.15) 0%,
      rgba(43, 145, 255, 0.15) 47.61%,
      rgba(85, 240, 255, 0.15) 95.22%
  );
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  margin: 0 auto 20px;
}

.welcome-message {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 0 0 10px;
  height: 115px;
}

.welcome-text {
  flex: 1;
  text-align: left;
}

.greeting {
  font-size: 12px;
  color: #646464;
  line-height: 20px;
  margin-bottom: 5px;
}

.main-message {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
}

.robot-avatar {
  flex-shrink: 0;
}

.robot-avatar img {
  width: 135px;
  height: 121px;
  object-fit: contain;
}

.services-section {
  background-color: #fff;
  border-radius: 16px;
  height: 92px;
  padding: 15px;
  backdrop-filter: blur(6px);
  position: relative;
}

.service-btn {
  position: absolute;
  width: 140px;
  height: 20px;
  top: -20px;
  left: 30px;
  background: #0032ff;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 6px 0px 0px;
  font-weight: 500;
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
}

.service-desc {
  font-size: 12px;
  color: #646464;
  line-height: 20px;
  margin: 0;
  text-align: left;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
}

.example-questions {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.example-questions h3 {
  margin-bottom: 15px;
  color: rgba(100, 100, 100, 0.8);
  font-size: 12px;
  font-weight: 400;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-item {
  display: flex;
  align-items: center;
  padding: 9px 8px;
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 6px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
}

.question-item:hover {
  background-color: #f0f0f0;
}

.question-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.question-text {
  flex: 1;
  font-size: 14px;
  color: #000000;
  line-height: 22px;
  text-align: left;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
}

.arrow-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* 自定义用户消息 */
.custom-user-message {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  width: 100%;
}

.message-bubble {
  background: #e3f2fd;
  border-radius: 12px 0 12px 12px;
  padding: 12px 16px;
  max-width: 70%;
  word-wrap: break-word;
  background: #0032ff1a;
}

.message-header-left-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #cbd3df;
  margin-left: 10px;
}

/* 自定义消息操作 */
.custom-message-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.custom-message-actions .action-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  opacity: 1;
}

.custom-message-actions .action-btn.active {
  background-color: #e3f2fd;
  border-color: #1976d2;
}

/* 自定义输入区域 */
.custom-input-area {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  /* background: #ffffff;
  border-top: 1px solid #e0e0e0; */
  align-items: center;
}

.source-link {
  color: rgba(0, 50, 255, 1);
}

.message-input {
  flex: 1;
  padding: 9px 14px;
  border: 1.5px solid #0032ff;
  border-radius: 8px;
  outline: none;
  font-size: 13px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
}

.message-input:focus {
  border-color: #0032ff;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(127.01deg, #55f0ff 12.69%, #0032ff 85.34%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0px 8px 20px rgba(15, 22, 41, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 新建聊天按钮 */
.new-chat-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.new-chat-button:hover {
  background-color: rgba(0, 50, 255, 0.1);
}

/* 背景效果 */
:deep(.chat-content) {
  background: linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, #f5f5f5 30%),
  linear-gradient(
      133.21deg,
      rgba(0, 50, 255, 0.1) 0%,
      rgba(62, 121, 239, 0.1) 28.05%,
      rgba(85, 240, 255, 0.1) 63.9%
  );
  position: relative;
}

:deep(.chat-content)::before {
  content: "";
  position: absolute;
  width: 310px;
  height: 310px;
  left: -71px;
  top: -90px;
  background: #55f0ff;
  opacity: 0.2;
  filter: blur(60px);
  pointer-events: none;
}

:deep(.chat-content)::after {
  content: "";
  position: absolute;
  width: 310px;
  height: 310px;
  left: 136px;
  top: -95px;
  background: #0032ff;
  opacity: 0.1;
  filter: blur(60px);
  pointer-events: none;
}

:deep .el-link {
  width: 100%;
  justify-content: flex-start;
}

:deep .el-link__inner {
  justify-content: flex-start;
  text-align: left;
  margin-left: 5px;
}

:deep .i-shadow-sm {
  display: none;
}

:deep .i-select-none {
  display: none;
}

:deep .message-card {
  background-color: #fff;
}
</style>
