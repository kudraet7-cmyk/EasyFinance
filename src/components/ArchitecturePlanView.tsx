import React, { useState } from 'react';
import { 
  FileCode, Layers, Cpu, Clock, 
  Terminal, Sparkles, Copy, Check, ExternalLink
} from 'lucide-react';
import { EXTENSION_SKELETON_FILES } from '../data/financialKnowledge';

export const ArchitecturePlanView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'blueprint' | 'tech' | 'code' | 'roadmap'>('blueprint');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleCopyCode = (name: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(name);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'blueprint', label: '总体方案设计', icon: Layers },
          { id: 'tech', label: '技术选型与权衡', icon: Cpu },
          { id: 'code', label: 'MV3 扩展代码骨架', icon: FileCode },
          { id: 'roadmap', label: '4周研发路线图', icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeSubTab === tab.id
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Blueprint */}
      {activeSubTab === 'blueprint' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h3 className="text-base font-bold text-white">easyFinance 核心架构与定位</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              easyFinance 定位为极简的「金融信息翻译层」。面向阅读公募基金合同、上市公司财报与行情图表的普通投资者，帮助消除金融专业术语门槛与信息不对称。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1.5">
                <div className="text-cyan-400 font-semibold text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  页面常驻：悬浮球 + 划词气泡
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  在任意金融站点注入极简悬浮球；用户鼠标选中文本即刻弹出白话解析卡片，无需离开当前阅读页面。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1.5">
                <div className="text-cyan-400 font-semibold text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  实时快讯：客观事实语音广播
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  聚合宏观经济公开统计（CPI、PMI）、央行公开市场业务等客观事实，支持 Web Speech 原生语音朗读。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1.5">
                <div className="text-cyan-400 font-semibold text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  公式还原：数学定义去包装
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  拆解公募基金管理费每日计提公式、分期贷款 IRR 真实年化折现、K线四要素几何分布，还原客观数学逻辑。
                </p>
              </div>
            </div>
          </div>

          {/* Architecture Data Flow */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              系统数据流转架构（四层纵深）
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 space-y-1.5">
                <div className="font-semibold text-cyan-300">1. 交互呈现层 (UI Layer)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Shadow DOM 封装悬浮球与划词 Popover，监听 <code>mouseup</code> 与选区变换，保证 100% 样式隔离。
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 space-y-1.5">
                <div className="font-semibold text-cyan-300">2. 后台安全过滤 (Filter)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  静默过滤交易建议与走势预测偏向，统一归一化为纯客观的概念定义与数学公式输出。
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 space-y-1.5">
                <div className="font-semibold text-cyan-300">3. 词典与翻译引擎 (Engine)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  本地离线高频金融词库（毫秒级命中）+ Gemini 3.8 Flash 结构化白话翻译，确保输出专业可靠。
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 space-y-1.5">
                <div className="font-semibold text-cyan-300">4. 事实资讯播报 (Broadcast)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Background Service Worker 定时拉取央行/统计局客观公开事实，调用 Web Speech API 提供语音朗读。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Technology Stack */}
      {activeSubTab === 'tech' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h3 className="text-base font-bold text-white">技术选型方案与架构权衡</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">模块</th>
                    <th className="py-2.5 px-3">选型推荐</th>
                    <th className="py-2.5 px-3">核心原因与权衡决策</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-cyan-300">宿主载体</td>
                    <td className="py-3 px-3 font-semibold text-white">Chrome Extension (Manifest V3)</td>
                    <td className="py-3 px-3 text-slate-400">
                      金融信息 85% 以上在桌面端网页（券商行情网、财报披露、基金页面）。iOS 禁止系统级悬浮窗；Android 无障碍权限极难保活；桌面应用包体庞大。浏览器插件是轻量且体验最佳的方案。
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-cyan-300">样式与隔离</td>
                    <td className="py-3 px-3 font-semibold text-white">Shadow DOM (Open Mode)</td>
                    <td className="py-3 px-3 text-slate-400">
                      金融网站通常自带海量全局 CSS 重置样式，若不使用 Shadow DOM，悬浮球和弹窗极易被宿主网页的 <code>z-index</code>、字体或全局规则干扰。
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-cyan-300">实时语音播报</td>
                    <td className="py-3 px-3 font-semibold text-white">Web Speech API (Synthesis)</td>
                    <td className="py-3 px-3 text-slate-400">
                      原生浏览器内置支持，0 额外服务器流量成本，离线可用，完美兼容中文朗读与播放/暂停控制。
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-cyan-300">AI 翻译层</td>
                    <td className="py-3 px-3 font-semibold text-white">Gemini 3.8 Flash + 本地词典</td>
                    <td className="py-3 px-3 text-slate-400">
                      服务端代理 API 保护密钥。Gemini 3.8 Flash 具备超高推理速度与确定性（设置 temperature=0.1）；配合本地高频词库保障毫秒级瞬间反馈。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Code Skeleton */}
      {activeSubTab === 'code' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              包含完整 Chrome Extension Manifest V3 核心文件：
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {EXTENSION_SKELETON_FILES.map((file) => (
              <div key={file.name} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-cyan-300">{file.name}</span>
                    <span className="text-[11px] text-slate-400">{file.description}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(file.name, file.code)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    {copiedFile === file.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFile === file.name ? '已复制' : '复制代码'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                  <code>{file.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: 4-Week Roadmap */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h3 className="text-base font-bold text-white">4 周时间盒落地实施计划</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  week: 'Week 1',
                  title: '骨架搭建与 Shadow DOM 隔离',
                  tasks: ['初始化 Chrome MV3 工程结构', '实现 Shadow DOM 样式无污染隔离', '构建可拖拽边缘吸附悬浮球']
                },
                {
                  week: 'Week 2',
                  title: '划词监听与本地词典引擎',
                  tasks: ['网页划词 Selection API 坐标计算', '内容脚本与 Background 通信总线', '嵌入高频金融白话词库 (离线毫秒级)']
                },
                {
                  week: 'Week 3',
                  title: '快讯语音流与大模型翻译',
                  tasks: ['集成 Web Speech API 实时语音朗读', '接入客观宏观快讯公开数据流', '接入 Gemini 3.8 Flash 结构化翻译代理']
                },
                {
                  week: 'Week 4',
                  title: '交互打磨与开源打包',
                  tasks: ['全局动效与暗色简约 UI 调优', '录制 60 秒核心交互演示视频', '撰写技术选型与工程 README 开源发布']
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                    <span>{item.week}</span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">
                    {item.title}
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 pl-3.5 list-disc pt-1">
                    {item.tasks.map((task, tIdx) => (
                      <li key={tIdx}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
