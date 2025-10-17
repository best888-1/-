package com.atguigu.lease.web.app.service.impl;

import com.atguigu.lease.common.exception.LeaseException;
import com.atguigu.lease.common.result.ResultCodeEnum;
import com.atguigu.lease.common.utils.JwtUtil;
import com.atguigu.lease.model.entity.UserInfo;
import com.atguigu.lease.model.enums.BaseStatus;
import com.atguigu.lease.web.app.mapper.UserInfoMapper;
import com.atguigu.lease.web.app.service.LoginService;
import com.atguigu.lease.web.app.vo.user.LoginVo;
import com.atguigu.lease.web.app.vo.user.UserInfoVo;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class LoginServiceImpl implements LoginService {


    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private UserInfoMapper userInfoMapper;




    @Override
    public String login(LoginVo loginVo) {


        LambdaQueryWrapper<UserInfo> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserInfo::getPhone, loginVo.getPhone());
        UserInfo userInfo = userInfoMapper.selectOne(queryWrapper);

        if (userInfo == null) {
            //注册
            userInfo = new UserInfo();
            userInfo.setPhone(loginVo.getPhone());
            userInfo.setNickname("尚庭公寓-" + loginVo.getPhone().substring(7));
            userInfo.setStatus(BaseStatus.ENABLE);
            userInfoMapper.insert(userInfo);
        } else {
            //禁用？
            if (userInfo.getStatus() == BaseStatus.DISABLE) {
                throw new LeaseException(ResultCodeEnum.APP_ACCOUNT_DISABLED_ERROR);
            }
        }

        return JwtUtil.createToken(userInfo.getId(), userInfo.getPhone());
    }

    @Override
    public UserInfoVo getLoginUserInfoById(Long userId) {
        UserInfo userInfo = userInfoMapper.selectById(userId);
        return  new UserInfoVo(userInfo.getNickname(),userInfo.getAvatarUrl());
    }
}
