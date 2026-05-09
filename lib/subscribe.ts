'use server';

import { Resend } from 'resend';
import type { SubscribePayload, SubscribeResult } from '@/types/article';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

const submitAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = submitAttempts.get(ip);

  if (!record || now > record.resetAt) {
    submitAttempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (record.count >= 3) return false;
  record.count++;
  return true;
}

function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: '请填写邮箱' };
  }
  if (email.length > 254) {
    return { valid: false, error: '邮箱长度超出限制' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: '邮箱格式不正确' };
  }
  return { valid: true };
}

export async function subscribe(payload: SubscribePayload): Promise<SubscribeResult> {
  if (!payload.email || !payload.consent) {
    return { success: false, message: '请填写邮箱并同意隐私政策' };
  }

  const emailCheck = validateEmail(payload.email);
  if (!emailCheck.valid) {
    return { success: false, message: emailCheck.error! };
  }

  if (!checkRateLimit('global')) {
    return { success: false, message: '操作过于频繁，请稍后重试' };
  }

  if (!AUDIENCE_ID) {
    return { success: false, message: '订阅功能尚未配置，请稍后再试' };
  }

  try {
    const { error } = await resend.contacts.create({
      email: payload.email,
      audienceId: AUDIENCE_ID,
    });

    if (error) {
      if (error.message?.includes('already exists')) {
        return { success: true, message: '您已订阅，感谢关注！' };
      }
      return { success: false, message: '订阅失败，请稍后重试' };
    }

    return { success: true, message: '订阅成功！感谢您的关注。' };
  } catch {
    return { success: false, message: '服务暂时不可用，请稍后重试' };
  }
}
